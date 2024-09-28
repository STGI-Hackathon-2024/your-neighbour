from os import walk
import face_recognition
import numpy as np
import pandas as pd
import pickle
import faiss


class DataLoader:
    def _init_(self, dataset_folder='./Dataset'):
        self.dataset_folder = dataset_folder
        self.face_embeddings = []
        self.face_labels = []
        self.index = None

    def load_images_and_generate_embeddings(self, face_crop_box=(0, 60, 51, 0)):
        """
        Loads images from the dataset folder and generates face embeddings.
        """
        filenames = next(walk("./Dataset"), (None, None, []))[2]
        filenames = ['./Dataset/' + filename for filename in filenames]
        for filename in filenames:
            image = face_recognition.load_image_file(filename)
            face_encodings = face_recognition.face_encodings(image, known_face_locations=[face_crop_box] if face_crop_box else None)
            
            if face_encodings:
                self.face_embeddings.append(face_encodings[0])
                self.face_labels.append(filename)

        self.face_embeddings = np.array(self.face_embeddings)
        self.face_labels = np.array(self.face_labels)

    def save_embeddings_to_file(self, filepath='face_db.pkl'):
        """
        Saves the face embeddings and labels to a pickle file.

        """
        with open(filepath, 'wb') as f:
            pickle.dump((self.face_embeddings, self.face_labels), f)

    def load_embeddings_from_file(self, filepath='face_db.pkl'):
        """
        Loads face embeddings and labels from a pickle file.
        """
        with open(filepath, 'rb') as f:
            self.face_embeddings, self.face_labels = pickle.load(f)

    def create_faiss_index(self):
        """
        Creates a FAISS index for the face embeddings.
        """
        d = self.face_embeddings.shape[1]  
        self.index = faiss.IndexFlatL2(d)  
        self.index.add(self.face_embeddings) 

    def save_faiss_index(self, filepath='face_index.faiss'):
        """
        Saves the FAISS index to a file.

        Parameters:
        """
        if self.index:
            faiss.write_index(self.index, filepath)

    def load_faiss_index(self, filepath='face_index.faiss'):
        """
        Loads a FAISS index from a file.
        """
        self.index = faiss.read_index(filepath)

    def search_face(self, query_image_path, face_crop_box=(0, 60, 51, 0), k=5):
        """
        Searches the FAISS index for similar faces to the query image.

        Returns:
        list: A list of tuples containing the matched image labels and their corresponding distances.
        """
        query_image = face_recognition.load_image_file(query_image_path)
        query_encodings = face_recognition.face_encodings(query_image, known_face_locations=[face_crop_box] if face_crop_box else None)

        if not query_encodings:
            return "No face found in the query image."

        query_encoding = np.array([query_encodings[0]]) 

        distances, indices = self.index.search(query_encoding, k)

        results = [(self.face_labels[idx], distances[0][i]) for i, idx in enumerate(indices[0])]
        return results