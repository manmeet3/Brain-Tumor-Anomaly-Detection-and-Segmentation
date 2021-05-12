# -*- coding: utf-8 -*-
# Implementation of Wang et al 2017: Automatic Brain Tumor Segmentation using Cascaded Anisotropic Convolutional Neural Networks. https://arxiv.org/abs/1709.00382

# Author: Guotai Wang
# Copyright (c) 2017-2018 University College London, United Kingdom. All rights reserved.
# http://cmictig.cs.ucl.ac.uk
#
# Distributed under the BSD-3 licence. Please see the file licence.txt
# This software is not certified for clinical use.
#
from __future__ import absolute_import, print_function
import numpy as np
from scipy import ndimage
import time
import os
import sys
import tensorflow as tf
from tensorflow.contrib.data import Iterator
from util.data_loader import *
from util.data_process import *
from util.train_test_func import *
from util.parse_config import parse_config
from train import NetFactory

class Segmentation():
    def __init__(self, config_file):
        # 1, load configure file
        config = parse_config(config_file)
        self.config_data = config['data']
        config_net1 = config.get('network1', None)
        config_net2 = config.get('network2', None)
        config_net3 = config.get('network3', None)
        self.config_test = config['testing']
        self.batch_size  = self.config_test.get('batch_size', 5)


        config_net1ax = config['network1ax']
        config_net1sg = config['network1sg']
        config_net1cr = config['network1cr']

        # construct graph for 1st network axial
        net_type1ax    = config_net1ax['net_type']
        net_name1ax    = config_net1ax['net_name']
        self.data_shape1ax  = config_net1ax['data_shape']
        self.label_shape1ax = config_net1ax['label_shape']
        self.class_num1ax   = config_net1ax['class_num']

        full_data_shape1ax = [self.batch_size] + self.data_shape1ax
        self.x1ax = tf.placeholder(tf.float32, shape = full_data_shape1ax)
        net_class1ax = NetFactory.create(net_type1ax)
        self.net1ax = net_class1ax(num_classes = self.class_num1ax, w_regularizer = None,
                    b_regularizer = None, name = net_name1ax)
        self.net1ax.set_params(config_net1ax)
        predicty1ax = self.net1ax(self.x1ax, is_training = True)
        self.proby1ax = tf.nn.softmax(predicty1ax)

        # construct graph for 1st network sagittal
        net_type1sg    = config_net1sg['net_type']
        net_name1sg    = config_net1sg['net_name']
        self.data_shape1sg  = config_net1sg['data_shape']
        self.label_shape1sg = config_net1sg['label_shape']
        class_num1sg   = config_net1sg['class_num']

        full_data_shape1sg = [self.batch_size] + self.data_shape1sg
        self.x1sg = tf.placeholder(tf.float32, shape = full_data_shape1sg)
        net_class1sg = NetFactory.create(net_type1sg)
        self.net1sg = net_class1sg(num_classes = class_num1sg,w_regularizer = None,
                    b_regularizer = None, name = net_name1sg)
        self.net1sg.set_params(config_net1sg)
        predicty1sg = self.net1sg(self.x1sg, is_training = True)
        self.proby1sg = tf.nn.softmax(predicty1sg)

        # construct graph for 1st network corogal
        net_type1cr    = config_net1cr['net_type']
        net_name1cr    = config_net1cr['net_name']
        self.data_shape1cr  = config_net1cr['data_shape']
        self.label_shape1cr = config_net1cr['label_shape']
        class_num1cr   = config_net1cr['class_num']

        full_data_shape1cr = [self.batch_size] + self.data_shape1cr
        self.x1cr = tf.placeholder(tf.float32, shape = full_data_shape1cr)
        net_class1cr = NetFactory.create(net_type1cr)
        self.net1cr = net_class1cr(num_classes = class_num1cr,w_regularizer = None,
                    b_regularizer = None, name = net_name1cr)
        self.net1cr.set_params(config_net1cr)
        predicty1cr = self.net1cr(self.x1cr, is_training = True)
        self.proby1cr = tf.nn.softmax(predicty1cr)


        if(self.config_test.get('whole_tumor_only', False) is False):
            # 2.2, networks for tumor core

            config_net2ax = config['network2ax']
            config_net2sg = config['network2sg']
            config_net2cr = config['network2cr']

            # construct graph for 2st network axial
            net_type2ax    = config_net2ax['net_type']
            net_name2ax    = config_net2ax['net_name']
            self.data_shape2ax  = config_net2ax['data_shape']
            self.label_shape2ax = config_net2ax['label_shape']
            self.class_num2ax   = config_net2ax['class_num']

            full_data_shape2ax = [self.batch_size] + self.data_shape2ax
            self.x2ax = tf.placeholder(tf.float32, shape = full_data_shape2ax)
            net_class2ax = NetFactory.create(net_type2ax)
            self.net2ax = net_class2ax(num_classes = self.class_num2ax, w_regularizer = None,
                        b_regularizer = None, name = net_name2ax)
            self.net2ax.set_params(config_net2ax)
            predicty2ax = self.net2ax(self.x2ax, is_training = True)
            self.proby2ax = tf.nn.softmax(predicty2ax)

            # construct graph for 2st network sagittal
            net_type2sg    = config_net2sg['net_type']
            net_name2sg    = config_net2sg['net_name']
            self.data_shape2sg  = config_net2sg['data_shape']
            self.label_shape2sg = config_net2sg['label_shape']
            self.class_num2sg   = config_net2sg['class_num']

            full_data_shape2sg = [self.batch_size] + self.data_shape2sg
            self.x2sg = tf.placeholder(tf.float32, shape = full_data_shape2sg)
            net_class2sg = NetFactory.create(net_type2sg)
            self.net2sg = net_class2sg(num_classes = self.class_num2sg, w_regularizer = None,
                        b_regularizer = None, name = net_name2sg)
            self.net2sg.set_params(config_net2sg)
            predicty2sg = self.net2sg(self.x2sg, is_training = True)
            self.proby2sg = tf.nn.softmax(predicty2sg)

            # construct graph for 2st network corogal
            net_type2cr    = config_net2cr['net_type']
            net_name2cr    = config_net2cr['net_name']
            self.data_shape2cr  = config_net2cr['data_shape']
            self.label_shape2cr = config_net2cr['label_shape']
            class_num2cr   = config_net2cr['class_num']

            full_data_shape2cr = [self.batch_size] + self.data_shape2cr
            self.x2cr = tf.placeholder(tf.float32, shape = full_data_shape2cr)
            net_class2cr = NetFactory.create(net_type2cr)
            self.net2cr = net_class2cr(num_classes = class_num2cr, w_regularizer = None,
                        b_regularizer = None, name = net_name2cr)
            self.net2cr.set_params(config_net2cr)
            predicty2cr = self.net2cr(self.x2cr, is_training = True)
            self.proby2cr = tf.nn.softmax(predicty2cr)

            # 2.3, networks for enhanced tumor
            config_net3ax = config['network3ax']
            config_net3sg = config['network3sg']
            config_net3cr = config['network3cr']

            # construct graph for 3st network axial
            net_type3ax    = config_net3ax['net_type']
            net_name3ax    = config_net3ax['net_name']
            self.data_shape3ax  = config_net3ax['data_shape']
            self.label_shape3ax = config_net3ax['label_shape']
            self.class_num3ax   = config_net3ax['class_num']

            full_data_shape3ax = [self.batch_size] + self.data_shape3ax
            self.x3ax = tf.placeholder(tf.float32, shape = full_data_shape3ax)
            net_class3ax = NetFactory.create(net_type3ax)
            self.net3ax = net_class3ax(num_classes = self.class_num3ax, w_regularizer = None,
                        b_regularizer = None, name = net_name3ax)
            self.net3ax.set_params(config_net3ax)
            predicty3ax = self.net3ax(self.x3ax, is_training = True)
            self.proby3ax = tf.nn.softmax(predicty3ax)

            # construct graph for 3st network sagittal
            net_type3sg    = config_net3sg['net_type']
            net_name3sg    = config_net3sg['net_name']
            self.data_shape3sg  = config_net3sg['data_shape']
            self.label_shape3sg = config_net3sg['label_shape']
            self.class_num3sg   = config_net3sg['class_num']
            # construct graph for 3st network
            full_data_shape3sg = [self.batch_size] + self.data_shape3sg
            self.x3sg = tf.placeholder(tf.float32, shape = full_data_shape3sg)
            net_class3sg = NetFactory.create(net_type3sg)
            self.net3sg = net_class3sg(num_classes = self.class_num3sg, w_regularizer = None,
                        b_regularizer = None, name = net_name3sg)
            self.net3sg.set_params(config_net3sg)
            predicty3sg = self.net3sg(self.x3sg, is_training = True)
            self.proby3sg = tf.nn.softmax(predicty3sg)

            # construct graph for 3st network corogal
            net_type3cr    = config_net3cr['net_type']
            net_name3cr    = config_net3cr['net_name']
            self.data_shape3cr  = config_net3cr['data_shape']
            self.label_shape3cr = config_net3cr['label_shape']
            self.class_num3cr   = config_net3cr['class_num']
            # construct graph for 3st network
            full_data_shape3cr = [self.batch_size] + self.data_shape3cr
            self.x3cr = tf.placeholder(tf.float32, shape = full_data_shape3cr)
            net_class3cr = NetFactory.create(net_type3cr)
            self.net3cr = net_class3cr(num_classes = self.class_num3cr, w_regularizer = None,
                        b_regularizer = None, name = net_name3cr)
            self.net3cr.set_params(config_net3cr)
            predicty3cr = self.net3cr(self.x3cr, is_training = True)
            self.proby3cr = tf.nn.softmax(predicty3cr)

        # 3, create session and load trained models
        all_vars = tf.global_variables()
        self.sess = tf.InteractiveSession()
        self.sess.run(tf.global_variables_initializer())

        net1ax_vars = [x for x in all_vars if x.name[0:len(net_name1ax) + 1]==net_name1ax + '/']
        saver1ax = tf.train.Saver(net1ax_vars)
        saver1ax.restore(self.sess, config_net1ax['model_file'])
        net1sg_vars = [x for x in all_vars if x.name[0:len(net_name1sg) + 1]==net_name1sg + '/']
        saver1sg = tf.train.Saver(net1sg_vars)
        saver1sg.restore(self.sess, config_net1sg['model_file'])
        net1cr_vars = [x for x in all_vars if x.name[0:len(net_name1cr) + 1]==net_name1cr + '/']
        saver1cr = tf.train.Saver(net1cr_vars)
        saver1cr.restore(self.sess, config_net1cr['model_file'])

        if(self.config_test.get('whole_tumor_only', False) is False):
            net2ax_vars = [x for x in all_vars if x.name[0:len(net_name2ax)+1]==net_name2ax + '/']
            saver2ax = tf.train.Saver(net2ax_vars)
            saver2ax.restore(self.sess, config_net2ax['model_file'])
            net2sg_vars = [x for x in all_vars if x.name[0:len(net_name2sg)+1]==net_name2sg + '/']
            saver2sg = tf.train.Saver(net2sg_vars)
            saver2sg.restore(self.sess, config_net2sg['model_file'])
            net2cr_vars = [x for x in all_vars if x.name[0:len(net_name2cr)+1]==net_name2cr + '/']
            saver2cr = tf.train.Saver(net2cr_vars)
            saver2cr.restore(self.sess, config_net2cr['model_file'])

            net3ax_vars = [x for x in all_vars if x.name[0:len(net_name3ax) + 1]==net_name3ax+ '/']
            saver3ax = tf.train.Saver(net3ax_vars)
            saver3ax.restore(self.sess, config_net3ax['model_file'])
            net3sg_vars = [x for x in all_vars if x.name[0:len(net_name3sg) + 1]==net_name3sg+ '/']
            saver3sg = tf.train.Saver(net3sg_vars)
            saver3sg.restore(self.sess, config_net3sg['model_file'])
            net3cr_vars = [x for x in all_vars if x.name[0:len(net_name3cr) + 1]==net_name3cr+ '/']
            saver3cr = tf.train.Saver(net3cr_vars)
            saver3cr.restore(self.sess, config_net3cr['model_file'])

    def test(self, unzipped_patient_folder_paths):
        # 4, load test images
        dataloader = DataLoader(self.config_data)
        #unzipped_patient_folders = ["/notebook/Masters_Project/segmentation_brats17/test_data/Brats17_CBICA_ABH_1", "/notebook/Masters_Project/segmentation_brats17/test_data/Brats17_UAB_3451_1"]
        dataloader.load_data(unzipped_patient_folder_paths)
        image_num = dataloader.get_total_image_number()
        print("image num: ", str(image_num))

        # 5, start to test
        test_slice_direction = self.config_test.get('test_slice_direction', 'all')
        save_folder = self.config_data['save_folder']
        test_time = []
        struct = ndimage.generate_binary_structure(3, 2)
        margin = self.config_test.get('roi_patch_margin', 5)

        for i in range(image_num):
            [temp_imgs, temp_weight, temp_name, img_names, temp_bbox, temp_size] = dataloader.get_image_data_with_name(i)
            t0 = time.time()
            # 5.1, test of 1st network

            data_shapes  = [self.data_shape1ax[:-1],  self.data_shape1sg[:-1],  self.data_shape1cr[:-1]]
            label_shapes = [self.label_shape1ax[:-1], self.label_shape1sg[:-1], self.label_shape1cr[:-1]]
            nets = [self.net1ax, self.net1sg, self.net1cr]
            outputs = [self.proby1ax, self.proby1sg, self.proby1cr]
            inputs =  [self.x1ax, self.x1sg, self.x1cr]
            class_num = self.class_num1ax

            prob1 = test_one_image_three_nets_adaptive_shape(temp_imgs, data_shapes, label_shapes, self.data_shape1ax[-1], class_num,
                       self.batch_size, self.sess, nets, outputs, inputs, shape_mode = 2)
            pred1 =  np.asarray(np.argmax(prob1, axis = 3), np.uint16)
            pred1 = pred1 * temp_weight

            wt_threshold = 2000
            if(self.config_test.get('whole_tumor_only', False) is True):
                pred1_lc = ndimage.morphology.binary_closing(pred1, structure = struct)
                pred1_lc = get_largest_two_component(pred1_lc, False, wt_threshold)
                out_label = pred1_lc
            else:
                # 5.2, test of 2nd network
                if(pred1.sum() == 0):
                    print('net1 output is null', temp_name)
                    bbox1 = get_ND_bounding_box(temp_imgs[0] > 0, margin)
                else:
                    pred1_lc = ndimage.morphology.binary_closing(pred1, structure = struct)
                    pred1_lc = get_largest_two_component(pred1_lc, False, wt_threshold)
                    bbox1 = get_ND_bounding_box(pred1_lc, margin)
                sub_imgs = [crop_ND_volume_with_bounding_box(one_img, bbox1[0], bbox1[1]) for one_img in temp_imgs]
                sub_weight = crop_ND_volume_with_bounding_box(temp_weight, bbox1[0], bbox1[1])


                data_shapes  = [ self.data_shape2ax[:-1],  self.data_shape2sg[:-1],  self.data_shape2cr[:-1]]
                label_shapes = [self.label_shape2ax[:-1], self.label_shape2sg[:-1], self.label_shape2cr[:-1]]
                nets = [self.net2ax, self.net2sg, self.net2cr]
                outputs = [self.proby2ax, self.proby2sg, self.proby2cr]
                inputs =  [self.x2ax, self.x2sg, self.x2cr]
                class_num = self.class_num2ax

                prob2 = test_one_image_three_nets_adaptive_shape(sub_imgs, data_shapes, label_shapes, self.data_shape2ax[-1],
                    class_num,  self.batch_size, self.sess, nets, outputs, inputs, shape_mode = 1)
                pred2 = np.asarray(np.argmax(prob2, axis = 3), np.uint16)
                pred2 = pred2 * sub_weight

                # 5.3, test of 3rd network
                if(pred2.sum() == 0):
                    [roid, roih, roiw] = sub_imgs[0].shape
                    bbox2 = [[0,0,0], [roid-1, roih-1, roiw-1]]
                    subsub_imgs = sub_imgs
                    subsub_weight = sub_weight
                else:
                    pred2_lc = ndimage.morphology.binary_closing(pred2, structure = struct)
                    pred2_lc = get_largest_two_component(pred2_lc)
                    bbox2 = get_ND_bounding_box(pred2_lc, margin)
                    subsub_imgs = [crop_ND_volume_with_bounding_box(one_img, bbox2[0], bbox2[1]) for one_img in sub_imgs]
                    subsub_weight = crop_ND_volume_with_bounding_box(sub_weight, bbox2[0], bbox2[1])


                data_shapes  = [ self.data_shape3ax[:-1],  self.data_shape3sg[:-1],  self.data_shape3cr[:-1]]
                label_shapes = [self.label_shape3ax[:-1], self.label_shape3sg[:-1], self.label_shape3cr[:-1]]
                nets = [self.net3ax, self.net3sg, self.net3cr]
                outputs = [self.proby3ax, self.proby3sg, self.proby3cr]
                inputs =  [self.x3ax, self.x3sg, self.x3cr]
                class_num = self.class_num3ax

                prob3 = test_one_image_three_nets_adaptive_shape(subsub_imgs, data_shapes, label_shapes, self.data_shape3ax[-1],
                    class_num, self.batch_size, self.sess, nets, outputs, inputs, shape_mode = 1)

                pred3 = np.asarray(np.argmax(prob3, axis = 3), np.uint16)
                pred3 = pred3 * subsub_weight

                # 5.4, fuse results at 3 levels
                # convert subsub_label to full size (non-enhanced)
                label3_roi = np.zeros_like(pred2)
                label3_roi = set_ND_volume_roi_with_bounding_box_range(label3_roi, bbox2[0], bbox2[1], pred3)
                label3 = np.zeros_like(pred1)
                label3 = set_ND_volume_roi_with_bounding_box_range(label3, bbox1[0], bbox1[1], label3_roi)

                label2 = np.zeros_like(pred1)
                label2 = set_ND_volume_roi_with_bounding_box_range(label2, bbox1[0], bbox1[1], pred2)

                label1_mask = (pred1 + label2 + label3) > 0
                label1_mask = ndimage.morphology.binary_closing(label1_mask, structure = struct)
                label1_mask = get_largest_two_component(label1_mask, False, wt_threshold)
                label1 = pred1 * label1_mask

                label2_3_mask = (label2 + label3) > 0
                label2_3_mask = label2_3_mask * label1_mask
                label2_3_mask = ndimage.morphology.binary_closing(label2_3_mask, structure = struct)
                label2_3_mask = remove_external_core(label1, label2_3_mask)
                if(label2_3_mask.sum() > 0):
                    label2_3_mask = get_largest_two_component(label2_3_mask)
                label1 = (label1 + label2_3_mask) > 0
                label2 = label2_3_mask
                label3 = label2 * label3
                vox_3  = np.asarray(label3 > 0, np.float32).sum()
                if(0 < vox_3 and vox_3 < 30):
                    label3 = np.zeros_like(label2)

                # 5.5, convert label and save output
                out_label = label1 * 2
                if('Flair' in self.config_data['modality_postfix'] and 'mha' in self.config_data['file_postfix']):
                    out_label[label2>0] = 3
                    out_label[label3==1] = 1
                    out_label[label3==2] = 4
                elif('flair' in self.config_data['modality_postfix'] and 'nii' in self.config_data['file_postfix']):
                    out_label[label2>0] = 1
                    out_label[label3>0] = 4
                out_label = np.asarray(out_label, np.int16)


            test_time.append(time.time() - t0)
            final_label = np.zeros(temp_size, np.int16)
            final_label = set_ND_volume_roi_with_bounding_box_range(final_label, temp_bbox[0], temp_bbox[1], out_label)
            save_array_as_nifty_volume(final_label, save_folder+"/{0:}.nii.gz".format(temp_name), img_names[0])
            print(temp_name)
        test_time = np.asarray(test_time)
        print('test time', test_time.mean())
        np.savetxt(save_folder + '/test_time.txt', test_time)

    def close(self):
        self.sess.close()

if __name__ == '__main__':
    if(len(sys.argv) != 2):
        print('Number of arguments should be 2. e.g.')
        print('    python test.py config17/test_all_class.txt')
        exit()
    config_file = str(sys.argv[1])
    assert(os.path.isfile(config_file))
    seg = Segmentation(config_file)
    unzipped_patient_folders = ["/notebook/Masters_Project/segmentation_brats17/test_data/Brats17_CBICA_AXN_1"]#["/notebook/Masters_Project/segmentation_brats17/test_data/Brats17_CBICA_ABH_1", "/notebook/Masters_Project/segmentation_brats17/test_data/Brats17_UAB_3451_1"]
    seg.test(unzipped_patient_folders)
    seg.close()
