import os
from dotenv import load_dotenv
import psycopg2
from psycopg2 import sql
from psycopg2 import pool
from tqdm import tqdm
import face_recognition
import numpy as np
from pgvector.psycopg2 import register_vector

load_dotenv("./.env")

def imageToVector(image):
    imageEncoding = face_recognition.face_encodings(image)
    return imageEncoding[0]


class DataLoader:
    def _init_(self):
        self.dbUrl = None
        self.dbpool = None
    
    def loadDb(self):
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
        self.Dburl = connectUrl
        self.dbpool = db_pool
    
    def searchImage(self, photo ):
        imageEncoding = imageToVector(photo)
        searhfolder = "%./casiawebface/%"
        with self.dbpool.getconn() as conn:
            with conn.cursor() as cur:
                cur.execute('CREATE EXTENSION IF NOT EXISTS vector')
                register_vector(conn)
                # cur.execute('SELECT image_name FROM images where image_name like %s ORDER BY embedding  <-> %s LIMIT 5', (searhfolder, imageEncoding))
                cur.execute('SELECT image_name, cosine_distance(%s, embedding) as distance FROM images where image_name like %s order by distance LIMIT 5', (imageEncoding, searhfolder))
                A = cur.fetchall()
        return A
    
t = DataLoader()
t.loadDb()

def search_image(photo):
    global t
    result = t.searchImage(photo)
    return result