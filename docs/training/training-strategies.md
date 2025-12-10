---
sidebar_position: 3
title: Training Strategies
---

# Training Strategies for Audio Models

Training large audio models requires careful engineering beyond choosing the right loss function. This page covers the practical strategies that make training stable, efficient, and effective.

## Learning Rate Scheduling

### Warm-Up

Start with a small learning rate and linearly increase over the first $N_{\text{warmup}}$ steps:

$$
\eta_t = \eta_{\max} \cdot \frac{t}{N_{\text{warmup}}}, \quad t \leq N_{\text{warmup}}
$$

Warm-up prevents large, destabilizing gradient updates in early training when model weights are randomly initialized.

### Cosine Annealing

After warm-up, decay the learning rate following a cosine schedule:

$$
\eta_t = \eta_{\min} + \frac{1}{2}(\eta_{\max} - \eta_{\min})\left(1 + \cos\left(\frac{\pi \cdot t}{T}\right)\right)
$$

Cosine decay is smoother than step decay and often yields better final performance.

### Warm-Up + Cosine (Common in Practice)

```
η
|  /‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾\
| /                   \
|/                     \___
└─────────────────────────── steps
  warmup   cosine decay
```

### Inverse Square Root

Used in some transformer training:

$$
\eta_t = \eta_{\max} \cdot \min\left(\frac{1}{\sqrt{t}}, \frac{t}{N_{\text{warmup}}^{3/2}}\right)
$$

## Optimizer Choice

### Adam and AdamW

Adam is the default optimizer for audio models:

$$
m_t = \beta_1 m_{t-1} + (1-\beta_1) g_t
$$
$$
v_t = \beta_2 v_{t-1} + (1-\beta_2) g_t^2
$$
$$
\theta_t = \theta_{t-1} - \eta \frac{\hat{m}_t}{\sqrt{\hat{v}_t} + \epsilon}
$$

**AdamW** decouples weight decay from the gradient update, which typically improves generalization:

$$
\theta_t = \theta_{t-1} - \eta \left(\frac{\hat{m}_t}{\sqrt{\hat{v}_t} + \epsilon} + \lambda \theta_{t-1}\right)
$$

Typical hyperparameters for audio:
- $\beta_1 = 0.9$, $\beta_2 = 0.999$
- $\epsilon = 10^{-8}$
- Weight decay $\lambda = 0.01$

### Other Optimizers

- **Lion**: Sign-based optimizer, lower memory, competitive with Adam on some tasks
- **Adafactor**: Memory-efficient factored optimizer for very large models
- **Sophia**: Second-order optimizer that has shown promise for language modeling

## Mixed Precision Training

Modern audio models use mixed precision (FP16 or BF16) to:
- Reduce memory usage by ~50%
- Speed up training by 2–3× on modern GPUs
- Enable larger batch sizes

The key components:

1. **FP16/BF16 forward pass**: faster computation
2. **FP32 master weights**: maintain precision for small gradient updates
3. **Loss scaling**: prevent gradient underflow in FP16

$$
\text{scaled\_loss} = \text{loss} \times s
$$

$$
\text{gradients} = \frac{\nabla \text{scaled\_loss}}{s}
$$

**BFloat16** is preferred over FP16 when available because it has the same exponent range as FP32, eliminating most overflow/underflow issues.

## Gradient Accumulation

When GPU memory is insufficient for the desired batch size, accumulate gradients over multiple micro-batches:

$$
g_{\text{effective}} = \frac{1}{K}\sum_{k=1}^{K} g_k
$$

Effective batch size = micro-batch size × accumulation steps × number of GPUs.

This is mathematically equivalent to training with the larger batch size (ignoring batch normalization effects).

## Distributed Training

### Data Parallelism (DDP)

- Replicate model on each GPU
- Each GPU processes different data
- Average gradients across GPUs via all-reduce
- Most common strategy for audio models

### Fully Sharded Data Parallelism (FSDP)

- Shard model parameters, gradients, and optimizer states across GPUs
- Each GPU holds only a fraction of the full model
- Enables training models that don't fit on a single GPU
- Higher communication overhead than DDP

### Model Parallelism

- Split model layers across GPUs
- Necessary for very large models (billions of parameters)
- More complex to implement, used mainly for the largest systems

## Training Stability Techniques

### Gradient Clipping

Prevent exploding gradients:

$$
g' = \begin{cases} g & \text{if } \|g\| \leq c \\ c \cdot \frac{g}{\|g\|} & \text{if } \|g\| > c \end{cases}
$$

Typical max norm $c = 1.0$ for transformer-based audio models.

### Exponential Moving Average (EMA)

Maintain an EMA of model weights for more stable inference:

$$
\theta_{\text{EMA}} = \beta \cdot \theta_{\text{EMA}} + (1-\beta) \cdot \theta
$$

Typical $\beta = 0.9999$. Use EMA weights for evaluation and generation; train with regular weights.

### Dropout and Regularization

- **Dropout**: standard in transformer layers ($p = 0.1$)
- **Weight decay**: L2 regularization via AdamW
- **Label smoothing**: soften one-hot targets for classification components

## Batch Size Considerations

| Batch Size | Effect |
|---|---|
| Small (1–8) | Noisy gradients, implicit regularization, slower convergence |
| Medium (16–64) | Good balance for most audio models |
| Large (128–512) | Smoother optimization, requires learning rate scaling |
| Very large (1k+) | May need LARS/LAMB optimizers, careful warm-up |

### Linear Scaling Rule

When increasing batch size by factor $k$, scale learning rate proportionally:

$$
\eta' = k \cdot \eta
$$

This heuristic (from large-scale vision training) works well with warm-up but can break down at extreme scales.

## Multi-Stage Training

Many state-of-the-art audio systems use staged training:

1. **Pre-training**: large, diverse, lower-quality data for general knowledge
2. **Fine-tuning**: smaller, high-quality data for target quality level
3. **Alignment**: human feedback or preference optimization (RLHF-style)

### Curriculum Learning

Order training data by difficulty:
- Start with cleaner, simpler examples
- Gradually introduce harder, noisier, or more complex music
- Can accelerate convergence and improve final quality

## Checkpointing and Resumption

- Save checkpoints every $N$ steps (not just every epoch)
- Include optimizer state for exact resumption
- Keep the best checkpoint by validation metric
- Use EMA checkpoints for final model selection

## Monitoring

Essential metrics to track during training:

| Metric | What It Tells You |
|---|---|
| Training loss | Optimization progress |
| Validation loss | Generalization |
| Gradient norm | Stability |
| Learning rate | Schedule correctness |
| GPU utilization | Efficiency |
| Throughput (samples/s) | Training speed |
| Discriminator accuracy | GAN balance (if applicable) |
| FAD on validation set | Audio quality trend |
