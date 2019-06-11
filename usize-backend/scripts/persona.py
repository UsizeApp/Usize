from skimage import io, transform
from sklearn import cluster
import cv2
import skimage.data as data
import skimage.segmentation as seg
import skimage.filters as filters
import skimage.draw as draw
import skimage.color as color
import numpy as np
import matplotlib.pyplot as plt

from imageai.Detection import ObjectDetection
import os

execution_path = os.getcwd()

def person_detector(file):
    detector = ObjectDetection()
    detector.setModelTypeAsRetinaNet()
    detector.setModelPath(os.path.join(execution_path , "resources/resnet50_coco_best_v2.0.1.h5"))
    detector.loadModel()
    detector.CustomObjects(person=True)
    filename, file_ext = os.path.splitext(file)
    output = filename+"_detection"+file_ext
    detections = detector.detectObjectsFromImage(input_image=file, output_image_path=output)
    if len(detections) == 0:
        print("Persona: 0 %")
        return "Persona", 0
    for eachObject in detections:
        object_type = eachObject["name"]
        probability = eachObject["percentage_probability"]
        print(object_type , " : " ,round(probability,2), "%")
        if object_type == "person":
            return object_type, probability
    return None, None