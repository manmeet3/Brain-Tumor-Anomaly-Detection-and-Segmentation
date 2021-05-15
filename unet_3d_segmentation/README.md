# Overview
This repository provides source code for brain tumor segmentation with BraTS dataset. The method is detailed in [1]

# Requirements
* A CUDA compatable GPU with >= 6GB is recommended for training. We used an Nvidia GTX 3070 for training.
* Tensorflow (v1.4.0). Install tensorflow following instructions from https://www.tensorflow.org/install/
* NiftyNet (v0.2.0). Install it by following instructions from http://niftynet.readthedocs.io/en/dev/installation.html 
* BraTS 2015 or 2017 dataset. BraTS is an annual Brain Tumor Segmentation competition. The datasets require a proper research oriented justification to gain access to.

# How to use
## 1, Prepare data
* Download BraTS dataset, and uncompress the training and tesing zip files. For example, the training set will be in `data_root/BRATS2015_Training` or `data_root/Brats17TrainingData` and the validation set will be in `data_root/BRATS2015_Validation` or `data_root/Brats17ValidationData`.


## 2, How to train
The trainig process needs 9 steps, with axial view, sagittal view, coronal view for whole tumor, tumor core, and enhancing core, respectively.

The following commands are examples for BraTS 2017. However, you can edit the corresponding `*.txt` files for different configurations.

* Train models for whole tumor in axial, sagittal and coronal views respectively. Run: 

```bash
python train.py config17/train_wt_ax.txt
python train.py config17/train_wt_sg.txt
python train.py config17/train_wt_cr.txt
```
* Train models for tumor core in axial, sagittal and coronal views respectively. Run: 

```bash
python train.py config17/train_tc_ax.txt
python train.py config17/train_tc_sg.txt
python train.py config17/train_tc_cr.txt
```
* Train models for enhancing core in axial, sagittal and coronal views respectively. Run: 

```bash
python train.py config17/train_en_ax.txt
python train.py config17/train_en_sg.txt
python train.py config17/train_en_cr.txt
```

* To save the time for training, you may use the modals in axial view as initalizations for sagittal and coronal views. Copy variables in axial view to those in sagittal or coronal view by running:

```bash
python util/rename_variables.py
```

You may need to edit this file to set different parameters. As an example for Brats 2015, after running this command, you will see a model named `model15/msnet_tc32sg_init` that is copied from `model15/msnet_tc32_20000.ckpt`. Then just set **start_iteration=1** and **model_pre_trained=model15/msnet_tc32sg_init** in `config15/train_tc_sg.txt`. 

## 3, How to test
Write a configure file that is similar to `config15/test_all_class.txt` or `config17/test_all_class.txt` and 
set the value of model_file to your own model files. Run:
```bash
python test.py your_own_config_for_test.txt
```

## 4, Evaluation
Calcuate dice scores between segmentation and the ground truth, run:
```bash
python util/evaluation.py
```
You may need to edit this file to  specify folders for segmentation and ground truth. 

## 5, Microservice
The test.py file implements a redis based interface that can be used to call inference from an external application. An incoming request needs to be sent to the channel "seg-handler" and a response is published to channel "seg-output" once inference has completed. The published response contains the path to the output file and a uuid that a requester submits for its processing request. 
```
REQUEST (from redis-cli): publish seg-handler "{\"uid\": 1234, \"zipfile\": \"/notebook/Masters_Project/segmentation_brats17/test_data/Brats17_TCIA_105_1.zip\"}"
RESPONSE: "{\"uid\": 1234, \"output\": \"/notebook/Masters_Project/segmentation_brats17/test_data/Brats17_TCIA_105_1_final.nii.gz\"}"
```

## 6, Misc
The response contains a path to a ready to view segmented .nii.gz file which can be loaded and viewed in any Nifty file viewer.

This implementation is based on NiftyNet and Tensorflow. While NiftyNet provides more automatic pipelines for dataloading, training, testing and evaluation, this naive implementation only makes use of NiftyNet for network definition, so that it is lightweight and extensible. A demo that makes more use of NiftyNet for brain tumor segmentation is proivde at
https://github.com/NifTK/NiftyNet/tree/dev/demos/BRATS17

* [1] Guotai Wang, Wenqi Li, Sebastien Ourselin, Tom Vercauteren. "Automatic Brain Tumor Segmentation using Cascaded Anisotropic Convolutional Neural Networks." In Brainlesion: Glioma, Multiple Sclerosis, Stroke and Traumatic Brain Injuries. Pages 179-190. Springer, 2018. https://arxiv.org/abs/1709.00382
* [2] Eli Gibson*, Wenqi Li*, Carole Sudre, Lucas Fidon, Dzhoshkun I. Shakir, Guotai Wang, Zach Eaton-Rosen, Robert Gray, Tom Doel, Yipeng Hu, Tom Whyntie, Parashkev Nachev, Marc Modat, Dean C. Barratt, Sébastien Ourselin, M. Jorge Cardoso^, Tom Vercauteren^.
"NiftyNet: a deep-learning platform for medical imaging." Computer Methods and Programs in Biomedicine, 158 (2018): 113-122. https://arxiv.org/pdf/1709.03485

Reference: This code was adapted from the following repository with credits to original author: https://github.com/taigw/brats17
