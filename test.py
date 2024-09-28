from deepface import DeepFace

import cv2

cam = cv2.VideoCapture(0)

cv2.namedWindow("Capture")

img_counter = 0

while True:
    ret, frame = cam.read()
    if not ret:
        print("failed to grab frame")
        break
    cv2.imshow("Capture", frame)

    k = cv2.waitKey(1)
    if k%256 == 27:
        # ESC pressed
        print("Escape hit, closing...")
        break
    elif k%256 == 32:
        # SPACE pressed
        img_name = "input.png"
        cv2.imwrite(img_name, frame)
        print("{} written!".format(img_name))
        break

cam.release()

cv2.destroyAllWindows()

RED = (0, 0, 255)
GREEN = (0, 255, 0)

def draw_bounding_box(image, x, y, w, h, color=GREEN):
    cv2.rectangle(image, (x, y), (x + w, y + h), color, 2)

# Load an image
image = cv2.imread('input.png')

face_objs = DeepFace.extract_faces(
  img_path="input.png",
  detector_backend="dlib",
  anti_spoofing = True
)

if(len(face_objs) > 1):
    print("More than one face detected!")
else:
    if(face_objs[0]["is_real"]):
        print("The face is real!")
    else:
        print("The face is fake!")
    fd = face_objs[0]["facial_area"]
    draw_bounding_box(image, fd["x"], fd["y"], fd["w"], fd["h"], GREEN if face_objs[0]["is_real"] else RED)
    cv2.imshow('Image with Bounding Box', image)
    cv2.waitKey(0)
    cv2.destroyAllWindows()