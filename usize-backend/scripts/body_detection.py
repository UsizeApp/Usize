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

image = data.astronaut()
plt.imshow(image)
print(image.shape)

image = io.imread("data/frontal2.jpg")
image = transform.rotate(image, -90, resize=True)
plt.imshow(image)
print(image.shape)

image_gray = color.rgb2gray(image) 
plt.imshow(image_gray,cmap = "gray");

print(image_gray.flatten().shape)
kmeans_cluster = cluster.KMeans(n_clusters=2)
kmeans_cluster.fit(image_gray)
cluster_centers = kmeans_cluster.cluster_centers_
cluster_labels = kmeans_cluster.labels_
plt.figure(figsize = (15,8))
plt.imshow(cluster_centers[cluster_labels], cmap = "gray")
print(cluster_centers[cluster_labels].shape)

#kmeans clustering
x, y, z = image.shape
image_2d = image.reshape(x*y, z)
kmeans_cluster = cluster.KMeans(n_clusters=2)
kmeans_cluster.fit(image_2d)
cluster_centers = kmeans_cluster.cluster_centers_
cluster_labels = kmeans_cluster.labels_
plt.figure(figsize = (15,8))
plt.imshow(cluster_centers[cluster_labels].reshape(x, y, z).astype(np.uint8))

#DBSCAN clustering
x, y, z = image.shape
image_2d = image.reshape(x*y, z)
DBSCAN_cluster = cluster.DBSCAN(eps = 50, metric = "euclidean", min_samples = 50)
DBSCAN_cluster.fit(image_2d)
cluster_centers = DBSCAN_cluster.cluster_centers_
cluster_labels = DBSCAN_cluster.labels_
plt.figure(figsize = (15,8))
plt.imshow(cluster_centers[cluster_labels].reshape(x, y, z).astype(np.uint8))


image = cv2.imread("data/frontal2.jpg")
#image = cv2.pyrDown(image)
#image = cv2.pyrDown(image)
Z = image.reshape((-1,3))
Z = np.float32(Z)
criteria = (cv2.TERM_CRITERIA_EPS + cv2.TERM_CRITERIA_MAX_ITER, 10, 1.0)
K = 2
ret,label,center=cv2.kmeans(Z,K,None,criteria,10,cv2.KMEANS_RANDOM_CENTERS)
center = np.uint8(center)
res = center[label.flatten()]
res2 = res.reshape((image.shape))
#cv2.imshow('res2',res2)
#cv2.waitKey(0)
#cv2.destroyAllWindows()
im2 = res2.copy()
im2[:, :, 0] = res2[:, :, 2]
im2[:, :, 2] = res2[:, :, 0]
plt.imshow(im2)

#Image thresholding
imagen = data.astronaut()
plt.hist(imagen.ravel(),bins = 10)
plt.show()

img = cv2.imread('data/frontal2.jpg')
im2 = img.copy()
im2[:, :, 0] = img[:, :, 2]
im2[:, :, 2] = img[:, :, 0]
im2_gray = color.rgb2gray(im2)
plt.imshow(im2_gray,cmap = "gray")

BLUR = 21
CANNY_THRESH_1 = 1
CANNY_THRESH_2 = 80
MASK_DILATE_ITER = 20
MASK_ERODE_ITER = 20
MASK_COLOR = (0.0,0.0,1.0) # In BGR format

img = cv2.pyrDown(img)
gray = cv2.cvtColor(img,cv2.COLOR_BGR2GRAY)

edges = cv2.Canny(gray, CANNY_THRESH_1, CANNY_THRESH_2)
edges = cv2.dilate(edges, None)
edges = cv2.erode(edges, None)

contour_info = []
contours, _ = cv2.findContours(edges, cv2.RETR_LIST, cv2.CHAIN_APPROX_NONE)

for c in contours:
    contour_info.append((
        c,
        cv2.isContourConvex(c),
        cv2.contourArea(c),
    ))
contour_info = sorted(contour_info, key=lambda c: c[2], reverse=True)
max_contour = contour_info[0]

mask = np.zeros(edges.shape)
cv2.fillConvexPoly(mask, max_contour[0], (255))

mask = cv2.dilate(mask, None, iterations=MASK_DILATE_ITER)
mask = cv2.erode(mask, None, iterations=MASK_ERODE_ITER)
mask = cv2.GaussianBlur(mask, (BLUR, BLUR), 0)
mask_stack = np.dstack([mask]*3)    # Create 3-channel alpha mask

mask_stack  = mask_stack.astype('float32') / 255.0          # Use float matrices, 
img         = img.astype('float32') / 255.0                 #  for easy blending

masked = (mask_stack * img) + ((1-mask_stack) * MASK_COLOR) # Blend
masked = (masked * 255).astype('uint8')                     # Convert back to 8-bit 

im2 = masked.copy()
im2[:, :, 0] = masked[:, :, 2]
im2[:, :, 2] = masked[:, :, 0]
plt.imshow(im2)

img = cv2.imread('data/frontal2.jpg')
print(img.shape)
img = cv2.pyrDown(img)
img = cv2.pyrDown(img)
print(img.shape)

# Snakes

def circle_points(resolution, center, radius):
    """
    Generate points which define a circle on an image.Centre refers to the centre of the circle
    """   
    radians = np.linspace(0, 2*np.pi, resolution)
    c = center[1] + radius*np.cos(radians)#polar co-ordinates
    r = center[0] + radius*np.sin(radians)
    
    return np.array([c, r]).T

def ellipse_points(resolution, center, a, b):
    radians = np.linspace(0, 2*np.pi, resolution)
    c = center[1] + a*np.cos(radians)#polar co-ordinates
    r = center[0] + b*np.sin(radians)
    
    return np.array([c, r]).T

def comparar(circle, snake):
    suma = 0
    size = len(circle)
    for i in range(size):
        suma += np.sqrt((circle[i][0] - snake[i][0])**2 + (circle[i][1] - snake[i][1])**2)
    return suma

# Exclude last point because a closed path should not have duplicate points



image = io.imread('data/frontal2.jpg')
print(image.shape)
image = cv2.pyrDown(image)
print(image.shape)
image = cv2.pyrDown(image)
print(image.shape)
image_gray = color.rgb2gray(image)
image_gray = transform.rotate(image_gray, -90, resize=True)

points = ellipse_points(int(image_gray.shape[1]/2), [image_gray.shape[0]/2, image_gray.shape[1]/2], image_gray.shape[0]/4, image_gray.shape[1]*0.75)[:-1]


plt.imshow(image_gray, cmap = "gray")
plt.plot(points[:, 0], points[:, 1], '--r', lw=3)

image_gray.shape

#image = data.astronaut()

#points = circle_points(200, [100, 220], 80)[:-1]

#image_gray = color.rgb2gray(image)
points = ellipse_points(300, [image_gray.shape[0]/2, image_gray.shape[1]/2], image_gray.shape[0]/5, image_gray.shape[1]*0.65)[:-1]

snake = seg.active_contour(image_gray, points, beta = 0.3)
plt.figure(figsize = (15,8))
plt.imshow(image_gray,cmap = "gray")
plt.plot(points[:, 0], points[:, 1], '--r', lw=3)
plt.plot(snake[:, 0], snake[:, 1], '-b', lw=3)

print(comparar(snake,points))

image = io.imread('data/frontal.jpg')
image_gray = color.rgb2gray(image)

snake = seg.active_contour(image_gray, points)
plt.figure(figsize = (15,8))
plt.imshow(image)
plt.plot(points[:, 0], points[:, 1], '--r', lw=3)
plt.plot(snake[:, 0], snake[:, 1], '-b', lw=3)

image = io.imread('data/frontal1.jpg')
image_gray = color.rgb2gray(image)
points = ellipse_points(250, [image_gray.shape[0]/2, image_gray.shape[1]/2], image_gray.shape[0]/4, image_gray.shape[1]*0.75)[:-1]

plt.imshow(image_gray, cmap = "gray")
plt.plot(points[:, 0], points[:, 1], '--r', lw=3)

snake = seg.active_contour(image_gray, points, beta = 0.3)
plt.figure(figsize = (15,8))
plt.imshow(image_gray,cmap = "gray")
plt.plot(points[:, 0], points[:, 1], '--r', lw=3)
plt.plot(snake[:, 0], snake[:, 1], '-b', lw=3)

# Histograma de colores
imagen = io.imread('data/frontal2.jpg')
imagen_gray = color.rgb2gray(imagen)
plt.hist(imagen_gray.ravel(),bins = 10)
plt.show()

# Red neuronal
import tensorflow as tf
from tensorflow.keras import layers