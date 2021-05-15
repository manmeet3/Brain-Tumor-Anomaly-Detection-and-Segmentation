# Brain Tumor Anomaly Detection and 3D Segmentation using Multimodal Brain MRI Data

University Name: http://www.sjsu.edu/

Course: Data Science

Professor: [Vijay Eranti](https://www.linkedin.com/in/vijay-eranti-6a6485/)

Team: [Asha Aher](https://www.linkedin.com/in/asha-aher)

Team: [Chinmay Vadgama](https://www.linkedin.com/in/chinmayvadgama/)

Team: [Manmeet Singh](https://www.linkedin.com/in/msingh16/)

Team: [Ronak Mehta](https://www.linkedin.com/in/ronakmehta21/)


## Project Introduction

Quantitative analysis of a brain MRI provides valuable information for regular health checkups, as well as treatment planning. Deep unsupervised learning has recently led to new approaches for Unsupervised Anomaly Detection. The main principle behind these works is to learn a model of normal brain anatomy by learning to compress and recover healthy data. As such, an MRI anomaly detection system can help physicians to determine the presence and severity of pathology. To demonstrate this capability from an end-user perspective, we train an unsupervised anomaly detection model using GANs.
Gliomas are brain tumors starting in the glial cells. Gliomas can be low grade (slow growing) or high grade (fast growing). Physicians use the grade of a brain tumor based on gliomas to decide which treatment a patient needs. The condition of the tumor is of vital importance for the treatment [16]. In this paper, we propose a automated system to differentiate between normal brain and abnormal brain with tumor in the MRI images and also further segment the regions affected by the tumor. We train a 3D U-Net based model which provides a radiologist with preliminary diagnosis regarding regions of interest for a given patient.

### Project Solution 
Our approach is based on the extraction of quantifiable features from MRIs for accessing normal or the severe degree of change, or the status of a particular disease condition. Our use case is that the GAN will initially learn a nominal representation of the brain and then identify anomalous regions based on reconstruction loss for a given instance of the MRI image. Ultimately, we are building a web platform where the hospital technicians can upload patient MRI images, that are pre-classified for a radiologist to look at, who can then verify or nullify the classification provided by our classifier. This approach can be extended to multiple diseases in the future, as well as tools that allow radiologists to curate what they are specifically looking for. Finally, the patients will receive a notification with their diagnosis along with access to their MRI scans via our web platform.

### Project Architecture 


### Web Platform Architecture 
![Web Architecture](https://github.com/manmeet3/Masters_Project/blob/master/architecture_diagrams/Web_Architecture.png?raw=true)




### Pre-requisites Set Up
* Docker Container for inferencing
* GPU

Web platform: 
* Install Angular 
* npm install
* node server.js
* ng serve --port 8080

### Web Platform Screenshots






### Reference Papers and code:
* https://www.kaggle.com/bonhart/brain-mri-data-visualization-unet-fpn
* https://pytorch.org/hub/mateuszbuda_brain-segmentation-pytorch_unet/
* https://www.med.upenn.edu/sbia/brats2017.html


