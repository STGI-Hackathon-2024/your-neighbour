import os
from dotenv import load_dotenv
import psycopg2
from psycopg2 import sql
from psycopg2 import pool
from tqdm import tqdm
import face_recognition

load_dotenv()

def loadDb():
    """
        Creates connection to Postgress neon
        returns error if it fails
    """
    connectUrl = os.getenv("Dburl")
    db_pool = psycopg2.pool.SimpleConnectionPool(
        1, 20, dsn=connectUrl
    )
    if (connectUrl):
        print("Connection pool successfully created")
    else:
        raise ConnectionError
    return db_pool

def imageToVector(imagePath):
    image = face_recognition.load_image_file(imagePath)
    #location = face_recognition.face_locations(image)
    imageEncoding = face_recognition.face_encodings(image, known_face_locations=[(0, 60, 51, 0)])
    return imageEncoding

def pushImages():
    filenames = next(os.walk("./casiawebface"), (None, None, []))[2]
    filenames = [ "./casiawebface/"+ filename for filename in filenames]

    Encoding = []
    i = 40000
    for filename in tqdm(filenames):
        Encoding.append(imageToVector(filename))
        if i == 0:
            break
        i = i-1
    print(Encoding)
    print(len(Encoding))
    
pushImages()