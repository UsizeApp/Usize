from imageai.Detection import ObjectDetection
import os


SPEED = "normal"  # normal, fast, fastest, flash
execution_path = os.getcwd()


def person_detector(file):
    detector = ObjectDetection()
    detector.setModelTypeAsRetinaNet()
    detector.setModelPath(os.path.join(
        execution_path, "resources/resnet50_coco_best_v2.0.1.h5"))
    detector.loadModel(detection_speed=SPEED)
    custom_objects = detector.CustomObjects(person=True)
    filename, file_ext = os.path.splitext(file)
    output = filename+"_detection"+file_ext
    detections = detector.detectCustomObjectsFromImage(
        custom_objects=custom_objects, input_image=file, output_image_path=output, minimum_percentage_probability=70)
    for eachObject in detections:
        object_type = eachObject["name"]
        probability = eachObject["percentage_probability"]
        print(object_type, " : ", probability, ":", eachObject["box_points"])
        if object_type == "person":
            return True
    return None


class MyDetector:
    detector = None
    custom_objects = None

    def __init__(self):
        self.detector = ObjectDetection()
        self.detector.setModelTypeAsRetinaNet()
        execution_path = os.getcwd()
        self.detector.setModelPath(os.path.join(
            execution_path, "resources/resnet50_coco_best_v2.0.1.h5"))
        self.detector.loadModel(detection_speed=SPEED)
        self.custom_objects = self.detector.CustomObjects(person=True)

    def person_detector(self, file):
        filename, file_ext = os.path.splitext(file)
        output = filename+"_detection"+file_ext

        detections = self.detector.detectCustomObjectsFromImage(
            custom_objects=self.custom_objects, input_image=file, output_image_path=output, minimum_percentage_probability=70)

        for eachObject in detections:
            object_type = eachObject["name"]
            probability = eachObject["percentage_probability"]
            print(object_type, " : ", probability,
                  ":", eachObject["box_points"])
            if object_type == "person":
                return True
        return None
