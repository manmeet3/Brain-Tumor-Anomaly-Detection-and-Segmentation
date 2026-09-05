# Baselines

Reference implementations and early experiments used to benchmark the primary anomaly detection model in [`anogan/`](../anogan).

- **[`ganomaly/`](ganomaly)** — the original [GANomaly](https://github.com/samet-akcay/ganomaly) PyTorch implementation, used as a semi-supervised anomaly detection baseline. See its [README](ganomaly/README.md) for installation and training instructions.
- **`WGAN_GP_with_OASIS3_Dataset.ipynb`** — an early Wasserstein GAN with gradient penalty experiment on the OASIS-3 dataset, exploring the GAN backbone before settling on the f-AnoGAN approach used in [`anogan/`](../anogan).
