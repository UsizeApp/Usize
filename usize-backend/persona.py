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

detector = ObjectDetection()
detector.setModelTypeAsRetinaNet()
detector.setModelPath( os.path.join(execution_path , "resnet50_coco_best_v2.0.1.h5"))
detector.loadModel()
custom = detector.CustomObjects(person=True)
detections = detector.detectObjectsFromImage(input_image=os.path.join(execution_path , "doggo.jpg"), output_image_path=os.path.join(execution_path , "doggonew.jpg"))
for eachObject in detections:
    print(eachObject["name"] , " : " , eachObject["percentage_probability"], ":", eachObject["box_points"])
