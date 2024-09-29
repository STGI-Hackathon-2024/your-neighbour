from deepface import DeepFace
from transformers.pipelines import pipeline
import time

BACKEND = "yolov8"

def find_face(image):
    face_objs = DeepFace.extract_faces(
        img_path = image, 
        detector_backend = BACKEND,
        enforce_detection=False
    )
    return len(face_objs)


def spoof(image):
    start = time.process_time()

    face_objs = DeepFace.extract_faces(
        img_path=image,
        detector_backend=BACKEND,
        anti_spoofing = True,
        enforce_detection=False
    )

    end = time.process_time()

    print(f"Time Taken: {end - start}")

    for face in face_objs:
        face["facial_area"]["is_real"] = face["is_real"]

    if(len(face_objs) > 1):
        return { "validity": False, "faces": [face["facial_area"] for face in face_objs] }
    elif(len(face_objs) == 0):
        return { "validity": False, "faces": [face["facial_area"] for face in face_objs] }
    else:
        if(face_objs[0]["is_real"]):
            return { "validity": True, "faces": [face["facial_area"] for face in face_objs] }
        else:
            return { "validity": False, "faces": [face["facial_area"] for face in face_objs] }
        

def match_with_document(photo, document):
    result = DeepFace.verify(
        img1_path = photo,
        img2_path = document,
        detector_backend=BACKEND,
        enforce_detection=False,
        threshold=0.75
    )

    print(result)

    return result["verified"]

ai_detector = pipeline(task="image-classification", model="Organika/sdxl-detector")

def ai_check(photo):
    global ai_detector
    result = ai_detector(photo)
    artificial = False
    for cl in result:
        if cl["label"] == 'artificial':
            artificial = cl["score"] > 0.7
    return artificial