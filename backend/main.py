from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from spoof import spoof, match_with_document, find_face, ai_check
from vecsearch import search_image
from PIL import Image
import io
import numpy as np

app = FastAPI()

origins = ["http://localhost:5173", "http://localhost:8000", "http://swift.local:8000"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/spoofing/")
async def anti_spoofing(file: UploadFile = File(...)):
    try:
        image_data = await file.read()
        image = Image.open(io.BytesIO(image_data)).convert('RGB')
        image_np = np.asarray(image)

        faces = spoof(image_np)
        return faces

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing image: {str(e)}")
    
@app.post("/matchdocument/")
async def match_document(photo: UploadFile = File(...), document: UploadFile = File(...)):
    try:
        photo_data = await photo.read()
        photo_np = np.asarray(Image.open(io.BytesIO(photo_data)).convert('RGB'))
        document_data = await document.read()
        document_np = np.asarray(Image.open(io.BytesIO(document_data)).convert('RGB'))

        msg = match_with_document(photo_np, document_np)

        return msg

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing image: {str(e)}")
    
@app.post("/countfaces/")
async def count_faces(photo: UploadFile = File(...)):
    try:
        photo_data = await photo.read()
        photo_np = np.asarray(Image.open(io.BytesIO(photo_data)).convert('RGB'))

        count = find_face(photo_np)
        
        return count

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing image: {str(e)}")
    
@app.post("/aidetect/")
async def aidetect(photo: UploadFile = File(...)):
    try:
        photo_data = await photo.read()
        photo_np = np.asarray(Image.open(io.BytesIO(photo_data)).convert('RGB'))

        result = ai_check(photo_np)
        
        return result

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing image: {str(e)}")
    
@app.post("/search/")
async def search(photo: UploadFile = File(...)):
    try:
        photo_data = await photo.read()
        photo_np = np.asarray(Image.open(io.BytesIO(photo_data)).convert('RGB'))

        result = search_image(photo_np)
        ai = ai_check(Image.open(io.BytesIO(photo_data)))
        
        return {"ai": ai, "results": result}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing image: {str(e)}")
    
@app.get("/casiawebface/{filename}")
async def get_image(filename):
    try:
        return FileResponse(f"./casiawebface/{filename}")

    except Exception as e:
        raise HTTPException(status_code=404, detail=f"Could not find image: {str(e)}")