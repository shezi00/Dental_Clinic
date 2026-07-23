# ai_service/main.py
import os
import time
import traceback
from typing import Optional, Dict
from dotenv import load_dotenv
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import warnings
import shutil
from google import genai
from google.genai import types
from google.genai.errors import APIError
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_chroma import Chroma
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from database import save_appointment_request

# Suppress Python 3.9 EOL and urllib3 OpenSSL warnings
warnings.filterwarnings("ignore", category=FutureWarning, module="google.*")
warnings.filterwarnings("ignore", category=UserWarning, module="google.*")
warnings.filterwarnings("ignore", category=FutureWarning)
warnings.filterwarnings("ignore", category=UserWarning, module="urllib3")
load_dotenv()

app = FastAPI(title="Harbord Dentistry AI Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
gemini_client = genai.Client(api_key=GEMINI_API_KEY)

MODEL_NAME = "gemini-3.5-flash"

CHROMA_DB_DIR = "chroma_db"
vectorstore = None

if os.path.exists(CHROMA_DB_DIR):
    try:
        embeddings = GoogleGenerativeAIEmbeddings(
            model="gemini-embedding-001",
            google_api_key=GEMINI_API_KEY
        )
        vectorstore = Chroma(
            persist_directory=CHROMA_DB_DIR,
            embedding_function=embeddings
        )
    except Exception as init_err:
        print(f"[CHROMA DB INIT WARNING]: {init_err}")

class ChatRequest(BaseModel):
    message: str
    booking_step: Optional[str] = None
    booking_data: Optional[Dict] = {}

def retrieve_rag_context(query: str) -> str:
    if not vectorstore:
        return "Clinic context unavailable."
    try:
        results = vectorstore.similarity_search(query, k=3)
        return "\n\n".join([doc.page_content for doc in results])
    except Exception as e:
        print(f"[RAG SEARCH ERROR SAFEGUARD]: {e}")
        return "Clinic context unavailable."

@app.post("/api/admin/upload-knowledge")
async def upload_knowledge_pdf(file: UploadFile = File(...)):
    global vectorstore
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed.")
    
    os.makedirs("data", exist_ok=True)
    file_path = os.path.join("data", "clinic_info.pdf")
    
    try:
        # Save the uploaded file, replacing the old one
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        # Re-run ingestion to update ChromaDB vectors
        loader = PyPDFLoader(file_path)
        docs = loader.load()
        text_splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
        chunks = text_splitter.split_documents(docs)
        
        embeddings = GoogleGenerativeAIEmbeddings(
            model="gemini-embedding-001",
            google_api_key=GEMINI_API_KEY
        )
        
        # Recreate the vector store and persist it
        vectorstore = Chroma.from_documents(
            chunks, 
            embeddings, 
            persist_directory=CHROMA_DB_DIR
        )
        
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Failed to process PDF: {str(e)}")
        
    return {"message": "PDF uploaded and knowledge base re-indexed successfully!"}

@app.post("/api/chat")
async def chat_endpoint(request: ChatRequest):
    try:
        msg = request.message.strip()
        step = request.booking_step
        data = request.booking_data or {}

        # =========================================================================
        # PURE PYTHON BOOKING FLOW — NO GEMINI / NO LLM AT ALL
        # =========================================================================

        # Start booking on explicit keywords if not already in a step
        booking_keywords = ["book", "appointment", "schedule", "reserve"]
        if not step and any(kw in msg.lower() for kw in booking_keywords):
            return {
                "reply": "I would be happy to help you book an appointment! To get started, could you please provide your **full name**?",
                "next_step": "AWAITING_NAME",
                "booking_data": {}
            }

        # Step 1: Name
        if step == "AWAITING_NAME":
            data["patient_name"] = msg
            return {
                "reply": f"Thanks, {msg}! What is your **email address** so we can send you confirmation details?",
                "next_step": "AWAITING_EMAIL",
                "booking_data": data
            }

        # Step 2: Email
        if step == "AWAITING_EMAIL":
            data["patient_email"] = msg
            return {
                "reply": "Got it! What is the best **phone number** to reach you at?",
                "next_step": "AWAITING_PHONE",
                "booking_data": data
            }

        # Step 3: Phone
        if step == "AWAITING_PHONE":
            data["patient_phone"] = msg
            return {
                "reply": "What **days of the week** do you prefer? (Note: We are open **Monday through Friday**; Saturdays and Sundays are closed)",
                "next_step": "AWAITING_DAYS",
                "booking_data": data
            }

        # Step 4: Days (Validate Monday–Friday)
        if step == "AWAITING_DAYS":
            day_msg = msg.lower()
            weekend_keywords = ["saturday", "sunday", "weekend", "weekends"]
            
            if any(wk in day_msg for wk in weekend_keywords):
                return {
                    "reply": "Our clinic is completely closed on Saturdays and Sundays. We are only open **Monday through Friday**. What weekday would you prefer?",
                    "next_step": "AWAITING_DAYS",
                    "booking_data": data
                }

            data["preferred_days"] = [msg]
            return {
                "reply": "And what **time of day** works best for you? (e.g., Morning, Afternoon, or Evening)",
                "next_step": "AWAITING_TIME",
                "booking_data": data
            }

        # Step 5: Time
        if step == "AWAITING_TIME":
            data["preferred_times"] = [msg]
            return {
                "reply": "What is the **reason for your visit**? (e.g., General Checkup, Cleaning, Toothache)",
                "next_step": "AWAITING_REASON",
                "booking_data": data
            }

        # Step 6: Reason
        if step == "AWAITING_REASON":
            data["reason_for_visit"] = msg
            return {
                "reply": "Are you currently experiencing any **pain or discomfort**? (Yes / No)",
                "next_step": "AWAITING_PAIN",
                "booking_data": data
            }

        # Step 7: Pain Check & Save to DB
        if step == "AWAITING_PAIN":
            pain_response = msg.lower()
            is_pain = any(word in pain_response for word in ["yes", "yeah", "yep", "severe", "hurts", "pain"])
            data["is_in_pain"] = is_pain

            # Save collected details directly into the database matching your schema
            save_appointment_request(
                patient_name=data.get("patient_name"),
                patient_email=data.get("patient_email"),
                patient_phone=data.get("patient_phone"),
                reason_for_visit=data.get("reason_for_visit", "General Checkup"),
                is_new_patient=True,
                is_in_pain=data.get("is_in_pain", False),
                preferred_days=data.get("preferred_days", []),
                preferred_times=data.get("preferred_times", [])
            )

            patient_name = data.get("patient_name", "there")
            urgency_note = " We note you are in pain and will prioritize your request." if is_pain else ""
            
            return {
                "reply": f"Thank you, {patient_name}! Your appointment request has been saved.{urgency_note} Our team will contact you shortly to confirm.",
                "next_step": None,
                "booking_data": {}
            }

        # =========================================================================
        # RAG Q&A FLOW — ONLY RUNS FOR GENERAL CLINIC QUESTIONS
        # =========================================================================
        pdf_context = retrieve_rag_context(msg)

        system_instruction = (
            "You are the AI assistant for Harbord Dentistry.\n"
            f"CLINIC KNOWLEDGE BASE:\n{pdf_context}\n\n"
            "Answer general questions about clinic services, hours, or policies directly. "
            "Note: The clinic is strictly closed on Saturdays and Sundays."
        )

        response = gemini_client.models.generate_content(
            model=MODEL_NAME,
            contents=msg,
            config=types.GenerateContentConfig(
                system_instruction=system_instruction,
                temperature=0.2
            )
        )

        return {
            "reply": response.text if response and response.text else "How can I help you today?",
            "next_step": None,
            "booking_data": {}
        }

    except Exception as e:
        traceback.print_exc()
        return {
            "reply": f"DEBUG ERROR: {type(e).__name__} - {str(e)}",
            "next_step": None,
            "booking_data": {}
        }