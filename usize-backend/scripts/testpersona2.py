from imageai.Detection import ObjectDetection
import os

execution_path = os.getcwd()
SPEED = "normal" # normal, fast, fastest, flash

def person_detector(file):
    detector = ObjectDetection()
    detector.setModelTypeAsRetinaNet()
    detector.setModelPath(os.path.join(execution_path , "resources/resnet50_coco_best_v2.0.1.h5"))
    detector.loadModel(detection_speed=SPEED)
    custom_objects = detector.CustomObjects(person=True)
    filename, file_ext = os.path.splitext(file)
    output = filename+"_detection"+file_ext
    detections = detector.detectCustomObjectsFromImage(custom_objects=custom_objects, input_image=file, output_image_path=output, minimum_percentage_probability=70)
    for eachObject in detections:
        object_type = eachObject["name"]
        probability = eachObject["percentage_probability"]
        print(object_type , " : " , probability, ":", eachObject["box_points"])
        if object_type == "person":
            return True
    return None

def a():
    detector = ObjectDetection()
    detector.setModelTypeAsRetinaNet()
    detector.setModelPath(os.path.join(execution_path , "resources/resnet50_coco_best_v2.0.1.h5"))
    detector.loadModel(detection_speed=SPEED)
    custom_objects = detector.CustomObjects(person=True)

    return detector, custom_objects

def b(detector, custom_objects, file):
    if isinstance(file, str):
        filename, file_ext = os.path.splitext(file)
        output = filename+"_detection"+file_ext
        detections = detector.detectCustomObjectsFromImage(custom_objects=custom_objects, input_image=file, output_image_path=output, minimum_percentage_probability=70)
    elif isinstance(file, bytes):
        detections = detector.detectCustomObjectsFromImage(custom_objects=custom_objects, input_image=file, input_type="array", output_image_path='outputtest.jpg', minimum_percentage_probability=70)
    else:
        print("detector error")
        return None


    for eachObject in detections:
        object_type = eachObject["name"]
        probability = eachObject["percentage_probability"]
        print(object_type , " : " , probability, ":", eachObject["box_points"])
        if object_type == "person":
            return True
    return None
