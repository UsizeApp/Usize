import cv2
import time
import numpy as np
import os
from scipy.spatial import distance as dist

def midpoint(p1, p2):
    if (p1 == None or p2 == None):
        return -1
    return [int((p1[0]+p2[0])/2) , int((p1[1]+p2[1])/2)]

def move(frame, point, direction, n, color):
    #0 move up, 1 move right, 2 move down, 3 move left
    #cv2.circle(frame, (point[0],point[1]), 8, (0,125,0), thickness=-1, lineType=cv2.FILLED)
    final = [point[1],point[0]]
    if((frame[tuple(final)] == color).all()):
        return [final[1],final[0]]
    if(direction == 0):
        for i in range(n):
            final[0] = final[0] - 1 
            if((frame[tuple(final)] == color).all()):
                print("i:",i)
                return [final[1],final[0]]
    if(direction == 1):
        for i in range(n):
            final[1] = final[1] + 1 
            if((frame[tuple(final)] == color).all()):
                print("i:",i)
                return [final[1],final[0]]
    if(direction == 2):
        for i in range(n):
            final[0] = final[0] + 1 
            if((frame[tuple(final)] == color).all()):
                print("i:",i)
                return [final[1],final[0]]
    if(direction == 3):
        for i in range(n):
            final[1] = final[1] - 1 
            if((frame[tuple(final)] == color).all()):
                print("i:",i)
                return [final[1],final[0]]
    if(direction == 4):
        for i in range(n):
            final[0] = final[0] - 1 
            final[1] = final[1] + 1  
            if((frame[tuple(final)] == color).all()):
                print("i:",i)
                return [final[1],final[0]]
    if(direction == 5):
        for i in range(n):
            final[0] = final[0] + 1 
            final[1] = final[1] + 1 
            if((frame[tuple(final)] == color).all()):
                print("i:",i)
                return [final[1],final[0]]
    if(direction == 6):
        for i in range(n):
            final[0] = final[0] + 1 
            final[1] = final[1] - 1 
            if((frame[tuple(final)] == color).all()):
                print("i:",i)
                return [final[1],final[0]]
    if(direction == 7):
        for i in range(n):
            final[0] = final[0] - 1 
            final[1] = final[1] - 1  
            if((frame[tuple(final)] == color).all()):
                print("i:",i)
                return [final[1],final[0]]
    return [final[1],final[0]]
    



MODE = "COCO"

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

    frameWidth = frame.shape[1]
    frameHeight = frame.shape[0]
    threshold = 0.1
    frameCopy = np.copy(frame)
    frameContours = np.copy(frame)
    frameGray = cv2.cvtColor(frame,cv2.COLOR_BGR2GRAY)
    


    edged = cv2.Canny(frameGray, 30, 200)
    #_,thresh = cv2.threshold(frameGray,70,255,0)
    contours = cv2.findContours(edged,cv2.RETR_TREE,cv2.CHAIN_APPROX_NONE)
    frameContours = cv2.drawContours(frameContours, contours, -1, (0,255,0), 3)
    
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

    right_shoulder = points[5]
    right_elbow = points[6]
    right_wrist = points[7]

    left_shoulder = points[2]
    left_elbow = points[3]
    left_wrist = points[4]

    #Adjust left arm points
    new_left_shoulder = move(frameContours, left_shoulder, 7, 100, (0,255,0))
    cv2.circle(frame, tuple(new_left_shoulder), 8, (255, 255, 255), thickness=-1, lineType=cv2.FILLED)
    new_left_elbow = move(frameContours, left_elbow, 3, 100, (0,255,0))
    cv2.circle(frame, tuple(new_left_elbow), 8, (255, 255, 255), thickness=-1, lineType=cv2.FILLED)
    new_left_wrist = move(frameContours, left_wrist, 3, 100, (0,255,0))
    new_left_wrist = move(frameContours, new_left_wrist, 2, 50, (0,255,0))
    cv2.circle(frame, tuple(new_left_wrist), 8, (255, 255, 255), thickness=-1, lineType=cv2.FILLED)

    #Draw lines
    cv2.line(frame,tuple(new_left_shoulder),tuple(new_left_elbow),(255,255,0),2)
    cv2.line(frame,tuple(new_left_elbow),tuple(new_left_wrist),(255,255,0),2)


    #Adjust right arm points
    new_right_shoulder = move(frameContours, right_shoulder, 4, 100, (0,255,0))
    cv2.circle(frame, tuple(new_right_shoulder), 8, (255, 255, 255), thickness=-1, lineType=cv2.FILLED)
    new_right_elbow = move(frameContours, right_elbow, 1, 100, (0,255,0))
    cv2.circle(frame, tuple(new_right_elbow), 8, (255, 255, 255), thickness=-1, lineType=cv2.FILLED)
    new_right_wrist = move(frameContours, right_wrist, 1, 100, (0,255,0))
    new_right_wrist = move(frameContours, new_right_wrist, 2, 50, (0,255,0))
    cv2.circle(frame, tuple(new_right_wrist), 8, (255, 255, 255), thickness=-1, lineType=cv2.FILLED)

    #Draw lines
    cv2.line(frame,tuple(new_right_shoulder),tuple(new_right_elbow),(255,255,0),2)
    cv2.line(frame,tuple(new_right_elbow),tuple(new_right_wrist),(255,255,0),2)
    

    right_humerus = dist.euclidean(right_shoulder, right_elbow)
    right_forearm = dist.euclidean(right_elbow, right_wrist)

    left_humerus = dist.euclidean(left_shoulder, left_elbow)
    left_forearm = dist.euclidean(left_elbow, left_wrist)

    right_arm = (right_humerus + right_forearm) / pixelsPerMetric
    left_arm = (left_humerus + left_forearm) / pixelsPerMetric
    #print(right_arm)
    #print(left_arm)

    new_right_humerus = dist.euclidean(new_right_shoulder, new_right_elbow)
    new_right_forearm = dist.euclidean(new_right_elbow, new_right_wrist)

    new_left_humerus = dist.euclidean(new_left_shoulder, new_left_elbow)
    new_left_forearm = dist.euclidean(new_left_elbow, new_left_wrist)

    new_right_arm = (new_right_humerus + new_right_forearm) / pixelsPerMetric
    new_left_arm = (new_left_humerus + new_left_forearm) / pixelsPerMetric
    #print(new_right_arm)
    #print(new_left_arm)
    

    # draw the object sizes on the image
    cv2.putText(frame, "{:.0f}cm".format(new_right_arm), (int(right_elbow[0] + 80), int(right_elbow[1])), cv2.FONT_HERSHEY_SIMPLEX, 3, (255, 255, 255), 2)
    cv2.putText(frame, "{:.0f}cm".format(new_left_arm), (int(left_elbow[0] - 300), int(left_elbow[1])), cv2.FONT_HERSHEY_SIMPLEX, 3, (255, 255, 255), 2)

    
    cv2.imwrite(os.path.abspath('output/Output-Keypoints.jpg'), frameCopy)
    cv2.imwrite(os.path.abspath('output/Output-Skeleton.jpg'), frame)
    cv2.imwrite(os.path.abspath('output/Output-frameContours.jpg'), frameContours)

    #cv2.imshow('Output-Keypoints', cv2.pyrDown(cv2.pyrDown(frameCopy)))
#    cv2.imshow('Output-Skeleton',cv2.pyrDown(cv2.pyrDown(frame)))
 #   cv2.imshow('Contours', cv2.pyrDown(cv2.pyrDown(frameContours)))
    
    
    measures = {
        "right": new_right_arm,
        "left": new_left_arm,
        "path": os.path.abspath('output/Output-Skeleton.jpg'),
        "time": "{:.3f}".format(time.time() - t)
    }

    #cv2.waitKey(0)

    return measures
