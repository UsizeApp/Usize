from scipy.spatial import distance as dist
import cv2
import time
import numpy as np
import os

MODE = "COCO"

def midpoint(p1, p2):
    if (p1 == None or p2 == None):
        return -1
    return [int((p1[0]+p2[0])/2) , int((p1[1]+p2[1])/2)]

def set_body_points(points):
    body = {
        "left_shoulder": points[5],
        "left_elbow": points[6],
        "left_wrist": points[7],
        "right_shoulder": points[2],
        "right_elbow": points[3],
        "right_wrist": points[4],
        "left_hip": points[11],
        "left_knee": points[12],
        "left_ankle": points[13],
        "right_hip": points[8],
        "right_knee": points[9],
        "right_ankle": points[10]
    }
    return body

def calculate(body_part, body, pixelsPerMetric):

    if body_part == "right_arm":
        right_humerus = dist.euclidean(body["right_shoulder"], body["right_elbow"])
        right_forearm = dist.euclidean(body["right_elbow"], body["right_wrist"])
        measure = (right_humerus + right_forearm) / pixelsPerMetric
    elif body_part == "left_arm":
        left_humerus = dist.euclidean(body["left_shoulder"], body["left_elbow"])
        left_forearm = dist.euclidean(body["left_elbow"], body["left_wrist"])
        measure = (left_humerus + left_forearm) / pixelsPerMetric
    elif body_part == "right_leg":
        right_femur = dist.euclidean(body["right_hip"], body["right_knee"])
        right_tibia = dist.euclidean(body["right_knee"], body["right_ankle"])
        measure = (right_femur + right_tibia) / pixelsPerMetric
    elif body_part == "left_leg":
        left_femur = dist.euclidean(body["left_hip"], body["left_knee"])
        left_tibia = dist.euclidean(body["left_knee"], body["left_ankle"])
        measure = (left_femur + left_tibia) / pixelsPerMetric
    elif body_part == "waist":
        measure = 0.0
    elif body_part == "hip":
        measure = 0.0
    elif body_part == "chest":
        measure = 0.0
    elif body_part == "bust":
        measure = 0.0

    return measure
    

def open_pose_image(file, body_height_cm):
    if MODE is "COCO":
        protoFile = os.path.abspath("pose/coco/pose_deploy_linevec.prototxt")
        weightsFile = os.path.abspath("pose/coco/pose_iter_440000.caffemodel")
        nPoints = 18
        POSE_PAIRS = [ [1,0],[1,2],[1,5],[2,3],[3,4],[5,6],[6,7],[1,8],[8,9],[9,10],[1,11],[11,12],[12,13],[0,14],[0,15],[14,16],[15,17]]

    elif MODE is "MPI" :
        protoFile = os.path.abspath("pose/mpi/pose_deploy_linevec_faster_4_stages.prototxt")
        weightsFile = os.path.abspath("pose/mpi/pose_iter_160000.caffemodel")
        nPoints = 15
        POSE_PAIRS = [[0,1], [1,2], [2,3], [3,4], [1,5], [5,6], [6,7], [1,14], [14,8], [8,9], [9,10], [14,11], [11,12], [12,13] ]


    frame = cv2.imread(file)
    frameCopy = np.copy(frame)
    frameWidth = frame.shape[1]
    frameHeight = frame.shape[0]
    threshold = 0.1

    net = cv2.dnn.readNetFromCaffe(protoFile, weightsFile)

    t = time.time()
    # input image dimensions for the network
    inWidth = 368
    inHeight = 368
    inpBlob = cv2.dnn.blobFromImage(frame, 1.0 / 255, (inWidth, inHeight),
                              (0, 0, 0), swapRB=False, crop=False)

    net.setInput(inpBlob)

    output = net.forward()
    print("time taken by network : {:.3f}".format(time.time() - t))

    H = output.shape[2]
    W = output.shape[3]

    # Empty list to store the detected keypoints
    points = []

    for i in range(nPoints):
        # confidence map of corresponding body's part.
        probMap = output[0, i, :, :]

        # Find global maxima of the probMap.
        minVal, prob, minLoc, point = cv2.minMaxLoc(probMap)
        
        # Scale the point to fit on the original image
        x = (frameWidth * point[0]) / W
        y = (frameHeight * point[1]) / H

        if prob > threshold : 
            cv2.circle(frameCopy, (int(x), int(y)), 8, (0, 255, 255), thickness=-1, lineType=cv2.FILLED)
            cv2.putText(frameCopy, "{}".format(i), (int(x), int(y)), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2, lineType=cv2.LINE_AA)

            # Add the point to the list if the probability is greater than the threshold
            points.append((int(x), int(y)))
        else :
            points.append(None)

    # Draw Skeleton
    for pair in POSE_PAIRS:
        partA = pair[0]
        partB = pair[1]

        if points[partA] and points[partB]:
            cv2.line(frame, points[partA], points[partB], (0, 255, 255), 2)
            cv2.circle(frame, points[partA], 8, (0, 0, 255), thickness=-1, lineType=cv2.FILLED)


    mouth = points[0]
    
    left_foot = points[10]
    right_foot = points[13]

    feet = midpoint(left_foot,right_foot)

    if(feet == -1):
        print("No se obtuvo la posición de un pie")
        feet = [0,0]

    cv2.circle(frame, tuple(feet), 8, (0, 255, 0), thickness=-1, lineType=cv2.FILLED)

    forehead = midpoint(points[14],points[15])
    forehead[1] = forehead[1] - (abs(mouth[1] - forehead[1])) 
    
    cv2.circle(frame, tuple(forehead), 8, (0, 255, 0), thickness=-1, lineType=cv2.FILLED)
    cv2.line(frame,tuple(feet),tuple(forehead),(255,0,0),2)
    
    height_in_pixels = dist.euclidean(forehead, feet)
    
    pixelsPerMetric = height_in_pixels / body_height_cm

    #sleeves = search_sleeves_v2(frame,left_wrist, 200, 100)
    #cv2.circle(frame, tuple(sleeves), 8, (255, 0, 0), thickness=-1, lineType=cv2.FILLED)

    # set body points
    body = set_body_points(points)

    # calculate the Euclidean distance of the body part
    right_arm   = calculate("right_arm",  body, pixelsPerMetric)
    left_arm    = calculate("left_arm",   body, pixelsPerMetric)
    right_leg   = calculate("right_leg",  body, pixelsPerMetric)
    left_leg    = calculate("left_leg",   body, pixelsPerMetric)
    waist       = calculate("waist",      body, pixelsPerMetric)
    hip         = calculate("hip",        body, pixelsPerMetric)
    chest       = calculate("chest",      body, pixelsPerMetric)
    bust        = calculate("bust",       body, pixelsPerMetric)

    # draw the object sizes on the image
    cv2.putText(frame, "{:.0f}cm".format(right_arm), (int(body["right_elbow"][0] + 80), int(body["right_elbow"][1])), cv2.FONT_HERSHEY_SIMPLEX, 3, (255, 255, 255), 2)
    cv2.putText(frame, "{:.0f}cm".format(left_arm), (int(body["left_elbow"][0] - 300), int(body["left_elbow"][1])), cv2.FONT_HERSHEY_SIMPLEX, 3, (255, 255, 255), 2)
    cv2.putText(frame, "{:.0f}cm".format(right_leg), (int(body["right_knee"][0] + 80), int(body["right_knee"][1])), cv2.FONT_HERSHEY_SIMPLEX, 3, (255, 255, 255), 2)
    cv2.putText(frame, "{:.0f}cm".format(left_leg), (int(body["left_knee"][0] - 300), int(body["left_knee"][1])), cv2.FONT_HERSHEY_SIMPLEX, 3, (255, 255, 255), 2)

    #cv2.imshow('Output-Keypoints', cv2.pyrDown(frameCopy))
    #cv2.imshow('Output-Skeleton', cv2.pyrDown(frame))

    cv2.imwrite(os.path.abspath('output/Output-Keypoints.jpg'), frameCopy)
    cv2.imwrite(os.path.abspath('output/Output-Skeleton.jpg'), frame)

    measures = {
        "right_arm": "%.1f" % right_arm,
        "left_arm": "%.1f" % left_arm,
        "right_leg": "%.1f" % right_leg,
        "left_leg": "%.1f" % left_leg,
        "waist": "%.1f" % waist,
        "hip": "%.1f" % hip,
        "chest": "%.1f" % chest,
        "bust": "%.1f" % bust,
        "path": os.path.abspath('output/Output-Skeleton.jpg'),
        "time": "{:.3f}".format(time.time() - t)
    }

    return measures
    #cv2.waitKey(0)
