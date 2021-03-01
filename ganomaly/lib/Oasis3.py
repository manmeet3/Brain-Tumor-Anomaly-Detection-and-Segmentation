import os
#import os.path
#import cv2
import glob
import torch
import random
import numpy as np
import pickle
from typing import Any, Callable, Optional, Tuple

from PIL import Image
from sklearn.model_selection import train_test_split

from torchvision.datasets import VisionDataset

class Oasis3(VisionDataset):
    """
    NOTE: The constructor automatically shuffles and samples ad and non-ad images at a 80:20 ratio
    ad_jpg_folder: system path with ad jpg images
    non_ad_jpg_folder: system path with non ad images
    """
    def __init__(self,
            root: str,
            ad_jpg_folder = None,
            non_ad_jpg_folder = None,
            train: bool = True,
            transform: Optional[Callable] = None,
            target_transform: Optional[Callable] = None) -> None:

        self.ad_jpg_folder = os.path.join(root, ad_jpg_folder)
        self.non_ad_jpg_folder = os.path.join(root, non_ad_jpg_folder)
            
        print("="*5 + " Loading Data " + "="*5)
        print(f"ad_jpg_folder: {self.ad_jpg_folder}")
        print(f"non_ad_jpg_folder: {self.non_ad_jpg_folder}")
            
        super(Oasis3, self).__init__(root, transform=transform, target_transform=target_transform)
        self.train = train 
        
        self.non_ad_data: Any = []
        self.non_ad_targets = []

        self.ad_data: Any = []
        self.ad_targets = []
        
        # Read data and label into a numpy array
        self.non_ad_data, self.non_ad_targets = self.read_data(self.ad_jpg_folder+'**.jpg', normal=True)
        self.ad_data, self.ad_targets = self.read_data(self.non_ad_jpg_folder+'**.jpg', normal=False)
        
        # shuffle the datasets and bucket them as test and train
        (self.non_ad_data, self.non_ad_targets) = self.shuffle_associated_arrays(self.non_ad_data, self.non_ad_targets)
        (self.ad_data, self.ad_targets) = self.shuffle_associated_arrays(self.ad_data, self.ad_targets)

        # concat the lists and random shuffle
        all_data = np.concatenate((self.non_ad_data, self.ad_data), axis=0)
        all_targets = self.non_ad_targets + self.ad_targets

        random.Random(1).shuffle(all_data)
        random.Random(1).shuffle(all_targets)

        # Use scikit learn to split complete data into test and train
        self.train_data, self.test_data, self.train_targets, self.test_targets =\
         train_test_split(all_data, all_targets, test_size=0.1, random_state=42)

        # Set test or train data based on input
        if self.train:
          self.data = self.train_data
          self.targets = self.train_targets
        else:
          self.data = self.test_data
          self.targets = self.test_targets
            
    def read_data(self, path, normal=True):
        data: Any = []
        labels = []
        
        for file_path in glob.glob(path):
            with open (file_path, 'rb') as f:
                # image needs to be a PIL image
                img = Image.open(f)
                # Resize all images 176, 256, 3 -> 256, 256, 0
                dsize = (256, 256)
                resized = img.resize(dsize)
                data.append(resized)
                labels.append(1 if normal else 0) 
        data = np.vstack(data).reshape(-1, 256, 256)
        data = data.transpose((0, 1, 2))  # convert to HWC
        return (data, labels)

    def shuffle_associated_arrays(self, data, targets):
        c = list(zip(data, targets))
        random.shuffle(c)
        data, targets = zip(*c)
        return (np.array(data), list(targets))
        
    def __len__(self):
        return len(self.data)

    def __getitem__(self, index: int) -> Tuple[Any, Any]:
        img, target = self.data[index], self.targets[index]
        
        img = Image.fromarray(img)
        
        if self.transform is not None:
            img = self.transform(img)

        if self.target_transform is not None:
            target = self.target_transform(target)

        return (img, target)
