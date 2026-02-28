from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import os
import json
from pathlib import Path
from typing import List

app = FastAPI()

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuration
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'pdf', 'txt', 'csv', 'xlsx', 'doc', 'docx'}

# Create uploads directory if it doesn't exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def allowed_file(filename: str) -> bool:
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.post("/files")
async def upload_files(files: List[UploadFile] = File(...)):
    """
    Upload multiple files to the backend
    Expects: multipart/form-data with files array
    Returns: JSON list of uploaded file info
    """
    if not files or len(files) == 0:
        raise HTTPException(status_code=400, detail="No files provided")
    
    uploaded_files = []
    errors = []
    
    for file in files:
        if file and allowed_file(file.filename):
            filename = file.filename
            filepath = os.path.join(UPLOAD_FOLDER, filename)
            
            # Save file
            content = await file.read()
            with open(filepath, 'wb') as f:
                f.write(content)
            
            uploaded_files.append({
                "name": filename,
                "path": filepath,
                "size": os.path.getsize(filepath),
                "status": "uploaded"
            })
        else:
            errors.append({
                "name": file.filename,
                "status": "error",
                "message": "File type not allowed or invalid filename"
            })
    
    return {
        "uploaded": uploaded_files,
        "errors": errors,
        "total": len(files)
    }

@app.get("/files")
async def list_files():
    """
    List all uploaded files
    """
    files = []
    for filename in os.listdir(UPLOAD_FOLDER):
        filepath = os.path.join(UPLOAD_FOLDER, filename)
        if os.path.isfile(filepath):
            files.append({
                "name": filename,
                "size": os.path.getsize(filepath)
            })
    return files

@app.delete("/files/{filename}")
async def delete_file(filename: str):
    """
    Delete a specific file
    """
    filepath = os.path.join(UPLOAD_FOLDER, filename)
    if os.path.exists(filepath):
        os.remove(filepath)
        return {"status": "deleted", "filename": filename}
    raise HTTPException(status_code=404, detail="File not found")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5000)
