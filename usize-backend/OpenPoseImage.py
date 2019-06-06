import cv2
import time
import numpy as np
from scipy.spatial import distance as dist

MODE = "COCO"

if MODE is "COCO":
    protoFile = "pose/coco/pose_deploy_linevec.prototxt"
    weightsFile = "pose/coco/pose_iter_440000.caffemodel"
    nPoints = 18
    POSE_PAIRS = [ [1,0],[1,2],[1,5],[2,3],[3,4],[5,6],[6,7],[1,8],[8,9],[9,10],[1,11],[11,12],[12,13],[0,14],[0,15],[14,16],[15,17]]

elif MODE is "MPI" :
    protoFile = "pose/mpi/pose_deploy_linevec_faster_4_stages.prototxt"
    weightsFile = "pose/mpi/pose_iter_160000.caffemodel"
    nPoints = 15
    POSE_PAIRS = [[0,1], [1,2], [2,3], [3,4], [1,5], [5,6], [6,7], [1,14], [14,8], [8,9], [9,10], [14,11], [11,12], [12,13] ]


frame = cv2.imread("samples/single.jpg")
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


caeza = points[14]
pies = points[10]
estatura_pixeles = dist.euclidean(caeza, pies)

estatura_cuerpo = 174
pixelsPerMetric = estatura_pixeles / estatura_cuerpo

right_shoulder = points[5]
right_elbow = points[6]
right_wrist = points[7]

left_shoulder = points[2]
left_elbow = points[3]
left_wrist = points[4]

# compute the Euclidean distance between the points
right_humerus = dist.euclidean(right_shoulder, right_elbow)
right_forearm = dist.euclidean(right_elbow, right_wrist)

left_humerus = dist.euclidean(left_shoulder, left_elbow)
left_forearm = dist.euclidean(left_elbow, left_wrist)

brazo_derecho = (right_humerus + right_forearm) / pixelsPerMetric
brazo_izquierdo = (left_humerus + left_forearm) / pixelsPerMetric
print(brazo_derecho)
print(brazo_izquierdo)

# draw the object sizes on the image
cv2.putText(frame, "{:.0f}cm".format(brazo_derecho), (int(right_elbow[0] + 80), int(right_elbow[1])), cv2.FONT_HERSHEY_SIMPLEX, 3, (255, 255, 255), 2)
cv2.putText(frame, "{:.0f}cm".format(brazo_izquierdo), (int(left_elbow[0] - 300), int(left_elbow[1])), cv2.FONT_HERSHEY_SIMPLEX, 3, (255, 255, 255), 2)

cv2.imshow('Output-Keypoints', frameCopy)
cv2.imshow('Output-Skeleton', frame)


cv2.imwrite('Output-Keypoints.jpg', frameCopy)
cv2.imwrite('Output-Skeleton.jpg', frame)

print("Total time taken : {:.3f}".format(time.time() - t))

cv2.waitKey(0)

