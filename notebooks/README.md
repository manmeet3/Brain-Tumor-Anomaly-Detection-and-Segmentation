# Notebooks

Google Colab notebooks used for data preparation and model experimentation ahead of the final implementations in [`anogan/`](../anogan), [`baselines/ganomaly/`](../baselines/ganomaly), and [`unet_3d_segmentation/`](../unet_3d_segmentation). These capture the exploratory work and are best read as a record of that process rather than production code.

## `data_preprocessing/`
Prepares the OASIS-3 dataset for anomaly-detection training.
- `1-oasis3-t1w-cdr-split.ipynb` — splits T1-weighted scans by Clinical Dementia Rating (CDR) to separate normal vs. abnormal subjects
- `2-Save_non-ad-jpg-slices.ipynb` / `3-Save_ad-jpg-slices.ipynb` — extract and save 2D JPEG slices for non-AD (normal) and AD (abnormal) volumes
- `data_pre_processing.ipynb` — general preprocessing utilities

## `AnomalyDetection/`
Anomaly detection experiments on OASIS-3 and MNIST.
- `4-load_oasis3_data.ipynb` — loads the preprocessed OASIS-3 slices for training
- `AnoGAN.ipynb` — AnoGAN experimentation
- `5-ganomaly_tf2.ipynb`, `5b_ganomaly_tf2.ipynb` — GANomaly ported to TensorFlow 2
- `GANomaly_mnist.ipynb`, `Test-Ganomaly.ipynb` — GANomaly sanity checks on MNIST before applying to brain MRI

## `TumorSegmentation/`
Segmentation experiments on the BraTS and Kaggle brain MRI datasets.
- `BRATS_Segmentation_UNet3D.ipynb` — 3D U-Net segmentation on BraTS
- `ganomaly-kaggle-1.ipynb`, `ganomaly-kaggle-2.ipynb` — GANomaly applied to a Kaggle brain MRI dataset
- `NIST_Normal_Avg.ipynb` — baseline "average normal scan" comparison
- `pretrain-finetune-inference.ipynb` — pretrain/fine-tune/inference workflow

## Note on paths

These notebooks were run on Google Colab and reference Google Drive paths and dataset locations specific to that environment. Update data paths at the top of each notebook before re-running locally or on a different Colab account.
