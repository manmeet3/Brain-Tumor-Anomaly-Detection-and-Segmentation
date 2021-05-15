#!/bin/bash

# This script helps set up the environment to run this code on top of tensorflow14-gpu container from official docker repository
# docker pull tensorflow/tensorflow:1.4.0-gpu

pip install nibabel
pip install SimpleITK
pip install NiftyNet==0.2.0
pip install flask
pip install redis
apt update
apt install redis-tools
