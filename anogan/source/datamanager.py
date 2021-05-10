import numpy as np

import glob
from numpy import asarray
from sklearn.utils import shuffle

#from PIL import Image
#from skimage.io import imread
import cv2 

class Dataset(object):

    def __init__(self, normalize=True):

        print("\nInitializing Dataset...")

        self.normalize = normalize
        normal_img_paths = glob.glob("/notebook/anogan/kaggle_tumor_detection/resized_no/*")
        tumor_img_paths = glob.glob("/notebook/anogan/kaggle_tumor_detection/resized_yes/*")
        #normal_img_paths = glob.glob("./resized_no/*")
        #tumor_img_paths = glob.glob("./resized_yes/*")
        imgs = []
        labels = []
        
        for img_path in normal_img_paths:
            #image = Image.open(img_path).convert('LA')
            #image = imread(img_path)
            
            image = cv2.imread(img_path, 0) # Read in grayscale mode
            #image = cv2.resize(img, (512, 512))
            imgs.append(asarray(image))
            labels.append(0)
            
        for img_path in tumor_img_paths:
            #image = Image.open(img_path).convert('LA')
            #image = imread(img_path)

            image = cv2.imread(img_path, 0) # Read in grayscale mode
            #image = cv2.resize(img, (512, 512))
            imgs.append(asarray(image))
            labels.append(1)
        print(f"x: {len(imgs)} y: {len(labels)}")
        self.X, self.y = shuffle(imgs, labels, random_state=0)
        
        # Read all yes and no datasets. Create labels 1 (yes) and 0 (no)
        # Shuffle them
        # split into test and train
        #self.x_tr, self.y_tr = x_tr, y_tr
        #self.x_te, self.y_te = x_te, y_te
        self.X = np.array(self.X)
        self.X = np.ndarray.astype(self.X, np.float32)
        print(f"Len self.x: {len(self.X)} self.y: {len(self.y)} ")
        #self.x_te = np.ndarray.astype(self.x_te, np.float32)
        print("Split dataset")
        self.split_dataset()
        print("done splitting")
        self.num_tr, self.num_te = self.x_tr.shape[0], self.x_te.shape[0]
        self.idx_tr, self.idx_te = 0, 0

        print("Number of data\nTraining: %d, Test: %d\n" %(self.num_tr, self.num_te))

        x_sample, y_sample = self.x_te[0], self.y_te[0]
        self.height = x_sample.shape[0]
        self.width = x_sample.shape[1]
        try: self.channel = x_sample.shape[2]
        except: self.channel = 1

        self.min_val, self.max_val = x_sample.min(), x_sample.max()
        self.num_class = (max(self.y)+1)

        print("Information of data")
        print("Shape  Height: %d, Width: %d, Channel: %d" %(self.height, self.width, self.channel))
        print("Value  Min: %.3f, Max: %.3f" %(self.min_val, self.max_val))
        print("Class  %d" %(self.num_class))
        print("Normalization: %r" %(self.normalize))
        if(self.normalize): print("(from %.3f-%.3f to %.3f-%.3f)" %(self.min_val, self.max_val, 0, 1))

    def split_dataset(self):

        #x_tot = np.append(self.x_tr, self.x_te, axis=0)
        #y_tot = np.append(self.y_tr, self.y_te, axis=0)

        x_normal, y_normal = None, None
        x_abnormal, y_abnormal = None, None
        for yidx, y in enumerate(self.y):
            
            x_tmp = np.expand_dims(self.X[yidx], axis=0)
            y_tmp = np.expand_dims(self.y[yidx], axis=0)

            if(y == 0): # as normal
                if(x_normal is None):
                    x_normal = x_tmp
                    y_normal = y_tmp
                else:
                    print(f"Appending normal. shape: {x_normal.shape}")
                    x_normal = np.append(x_normal, x_tmp, axis=0)
                    y_normal = np.append(y_normal, y_tmp, axis=0)

            else: # as abnormal
                if(x_abnormal is None):
                    x_abnormal = x_tmp
                    y_abnormal = y_tmp
                else:
                    if(x_abnormal.shape[0] < 100):
                        print(f"x_abnormal shape: {x_abnormal.shape} < 100, appending")
                        x_abnormal = np.append(x_abnormal, x_tmp, axis=0)
                        y_abnormal = np.append(y_abnormal, y_tmp, axis=0)

            if(not(x_normal is None) and not(x_abnormal is None)):
                if((x_normal.shape[0] >= 1000) or x_abnormal.shape[0] >= 150): break

        self.x_tr, self.y_tr = x_normal[:600], y_normal[:600] 
        self.x_te, self.y_te = x_normal[600:], y_normal[600:]
        self.x_te = np.append(self.x_te, x_abnormal, axis=0)
        self.y_te = np.append(self.y_te, y_abnormal, axis=0)

    def reset_idx(self): self.idx_tr, self.idx_te = 0, 0

    def next_train(self, batch_size=1, fix=False):

        start, end = self.idx_tr, self.idx_tr+batch_size
        x_tr, y_tr = self.x_tr[start:end], self.y_tr[start:end]
        x_tr = np.expand_dims(x_tr, axis=3)

        terminator = False
        if(end >= self.num_tr):
            terminator = True
            self.idx_tr = 0
            self.x_tr, self.y_tr = shuffle(self.x_tr, self.y_tr)
        else: self.idx_tr = end

        if(fix): self.idx_tr = start

        if(x_tr.shape[0] != batch_size):
            x_tr, y_tr = self.x_tr[-1-batch_size:-1], self.y_tr[-1-batch_size:-1]
            x_tr = np.expand_dims(x_tr, axis=3)

        if(self.normalize):
            min_x, max_x = x_tr.min(), x_tr.max()
            x_tr = (x_tr - min_x) / (max_x - min_x)

        return x_tr, y_tr, terminator

    def next_test(self, batch_size=1):

        start, end = self.idx_te, self.idx_te+batch_size
        x_te, y_te = self.x_te[start:end], self.y_te[start:end]
        x_te = np.expand_dims(x_te, axis=3)

        terminator = False
        if(end >= self.num_te):
            terminator = True
            self.idx_te = 0
        else: self.idx_te = end

        if(self.normalize):
            min_x, max_x = x_te.min(), x_te.max()
            x_te = (x_te - min_x) / (max_x - min_x)

        return x_te, y_te, terminator
