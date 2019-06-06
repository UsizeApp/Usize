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
    custom = detector.CustomObjects(person=True)
    filename, file_ext = os.path.splitext(file)
    output = filename+"_detection"+file_ext
    detections = detector.detectObjectsFromImage(input_image=file, output_image_path=output)
    for eachObject in detections:
        object_type = eachObject["name"]
        probability = eachObject["percentage_probability"]
        if object_type == "person":
            return object_type, probability
        print(object_type , " : " , probability, ":", eachObject["box_points"])
    return None, None
