# ai_service/ingest_pdf.py
import os
from dotenv import load_dotenv
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_community.vectorstores import Chroma

load_dotenv()

PDF_PATH = "data/clinic_info.pdf"
CHROMA_DB_DIR = "chroma_db"

def ingest_pdf():
    if not os.path.exists(PDF_PATH):
        print(f"❌ Error: Place your clinic PDF at {PDF_PATH}")
        return

    print("📄 Loading PDF document...")
    loader = PyPDFLoader(PDF_PATH)
    documents = loader.load()

    # Split document into chunks
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=600,
        chunk_overlap=100
    )
    docs = text_splitter.split_documents(documents)
    print(f"✂️ Processed {len(docs)} document chunks.")

    print("🧠 Generating Gemini embeddings and indexing into ChromaDB...")
    
    # FIX: Pass "text-embedding-004" WITHOUT the "models/" prefix
    embeddings = GoogleGenerativeAIEmbeddings(
        model="gemini-embedding-001",
        google_api_key=os.getenv("GEMINI_API_KEY")
    )
    
    Chroma.from_documents(
        documents=docs,
        embedding=embeddings,
        persist_directory=CHROMA_DB_DIR
    )
    print("✅ Indexing complete! Data stored in 'chroma_db'.")

if __name__ == "__main__":
    ingest_pdf()