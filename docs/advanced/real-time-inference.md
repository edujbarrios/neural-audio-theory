---
sidebar_position: 2
title: Real-Time Inference
---

# Real-Time Audio Inference

Deploying AI music models in real-time or near-real-time applications requires careful optimization of latency, throughput, and computational efficiency. This page covers the engineering strategies for fast audio inference.

## Latency Requirements

Different applications have different latency budgets:

| Application | Max Latency | Challenge Level |
|---|---|---|
| Live performance | &lt;10 ms | Extreme |
| Interactive music tools | &lt;100 ms | Very hard |
| Real-time voice conversion | &lt;50 ms | Hard |
| Streaming generation | &lt;1 second | Moderate |
| Batch generation | Minutes | Easy |
| Offline processing | Hours | Trivial |

$$
\text{Total latency} = T_{\text{input}} + T_{\text{compute}} + T_{\text{output}} + T_{\text{network}}
$$

## Model Optimization Techniques

### Quantization

Reduce numerical precision of model weights and activations:

**Post-Training Quantization (PTQ)**:
$$
w_q = \text{round}\left(\frac{w}{\Delta}\right) \cdot \Delta, \quad \Delta = \frac{w_{\max} - w_{\min}}{2^B - 1}
$$

| Precision | Memory | Speed | Quality |
|---|---|---|---|
| FP32 | 4 bytes/param | Baseline | Reference |
| FP16 | 2 bytes/param | ~2× faster | Near-identical |
| INT8 | 1 byte/param | ~3–4× faster | Slight degradation |
| INT4 | 0.5 bytes/param | ~5–6× faster | Noticeable degradation |

**Quantization-Aware Training (QAT)**: simulate quantization during training, resulting in better quality at low precision.

For audio models, INT8 quantization typically preserves quality. INT4 may introduce audible artifacts in vocoders.

### Knowledge Distillation

Train a smaller "student" model to mimic a larger "teacher":

$$
\mathcal{L}_{\text{distill}} = \alpha \mathcal{L}_{\text{task}} + (1-\alpha) \mathcal{L}_{\text{KD}}
$$

$$
\mathcal{L}_{\text{KD}} = D_{\text{KL}}(p_{\text{student}} \| p_{\text{teacher}})
$$

Distillation can reduce model size by 2–10× while retaining most quality.

### Pruning

Remove unnecessary weights:

**Structured pruning**: remove entire channels, heads, or layers
**Unstructured pruning**: zero out individual weights by magnitude

$$
w'_i = \begin{cases} w_i & \text{if } |w_i| > \theta \\ 0 & \text{otherwise} \end{cases}
$$

Typical audio models can be pruned 30–50% with minimal quality loss.

### Architecture-Level Optimizations

**Reduce attention layers**: attention is the bottleneck for long sequences
**Use efficient attention**: Flash Attention, linear attention
**Reduce model depth**: fewer layers with wider channels
**Cache key-value pairs**: for autoregressive models, cache KV states

### KV-Cache for Autoregressive Models

In autoregressive generation, caching previous key-value pairs avoids recomputation:

Without cache: each token requires attending to all previous tokens from scratch
With cache: only compute attention for the new token against cached KV pairs

$$
\text{Speedup} \approx \frac{T}{1} = T\times
$$

for generating $T$ tokens. KV-caching is essential for real-time autoregressive audio.

## Diffusion Model Speedups

Diffusion models are inherently slow due to iterative denoising. Several strategies reduce the number of steps:

### Fewer Diffusion Steps

Standard: 50–1000 steps. Optimized: 4–20 steps.

**DDIM (Denoising Diffusion Implicit Models)**:

$$
x_{t-1} = \sqrt{\bar{\alpha}_{t-1}}\hat{x}_0 + \sqrt{1-\bar{\alpha}_{t-1}-\sigma_t^2}\epsilon_\theta(x_t, t) + \sigma_t \epsilon
$$

DDIM enables deterministic sampling with fewer steps (e.g., 50 → 10).

### Consistency Models

Train a model to directly predict the final clean sample from any noise level:

$$
f_\theta(x_t, t) \approx x_0 \quad \forall t
$$

Enables 1-step or 2-step generation.

### Progressive Distillation

Distill a multi-step diffusion model into fewer steps:

1. Start with N-step model
2. Train student to match N/2 steps
3. Repeat: N/4, N/8, etc.
4. End with 1–4 step model

### Latent Diffusion (Compression-First)

Diffuse in compressed latent space rather than raw audio:

$$
\text{Speedup} \approx \frac{T_{\text{audio}}}{T_{\text{latent}}} \times \frac{C_{\text{audio}}}{C_{\text{latent}}}
$$

Typical latent compression: 64–256× fewer elements than raw audio.

## Vocoder Optimization

The vocoder (mel → waveform) is often the latency bottleneck in mel-spectrogram-based systems.

### Streaming Vocoders

Process audio in chunks rather than waiting for the full spectrogram:

```
Mel chunk 1 ──▶ Vocoder ──▶ Audio chunk 1 (output immediately)
Mel chunk 2 ──▶ Vocoder ──▶ Audio chunk 2 (output immediately)
...
```

Requires causal architecture (no future lookahead).

### Faster Vocoder Architectures

| Vocoder | RTF (GPU) | Quality |
|---|---|---|
| WaveNet | 0.01× | Excellent |
| HiFi-GAN V1 | ~80× | Very good |
| HiFi-GAN V3 | ~150× | Good |
| Vocos | ~200× | Good |
| MB-MelGAN | ~150× | Good |

RTF = Real-Time Factor (>1× means faster than real-time).

### ONNX / TensorRT

Export vocoders to optimized inference formats:

- **ONNX**: cross-platform, moderate optimization
- **TensorRT**: NVIDIA GPU, aggressive optimization (2–5× over PyTorch)
- **CoreML**: Apple Silicon optimization
- **OpenVINO**: Intel optimization

## Hardware Considerations

### GPU Inference

| GPU | VRAM | Suitable For |
|---|---|---|
| RTX 3060 | 12 GB | Small models, vocoders |
| RTX 4090 | 24 GB | Medium models, real-time |
| A100 | 40/80 GB | Large models, batch |
| H100 | 80 GB | Largest models, lowest latency |

### CPU Inference

For edge deployment:
- ONNX Runtime with optimized kernels
- Quantized INT8 models
- Limited to small models or vocoders
- Latency: 10–100× slower than GPU

### Edge / Mobile

| Platform | Framework | Feasibility |
|---|---|---|
| iOS | CoreML | Vocoders, small models |
| Android | TFLite, ONNX | Vocoders, small models |
| Raspberry Pi | ONNX | Vocoders only |
| Web (WASM) | ONNX.js | Very limited |

## Streaming Architecture

For real-time applications, implement a streaming pipeline:

```
Input (continuous) ──▶ Buffer ──▶ Model (chunk processing) ──▶ Output Buffer ──▶ Audio Out
                        │                                           │
                    Input chunk                               Output chunk
                    (overlap)                                 (crossfade)
```

### Overlap-Add for Seamless Output

Process overlapping chunks and crossfade:

$$
y[n] = \sum_{k} y_k[n - kH] \cdot w[n - kH]
$$

where $H$ is the hop between chunks and $w$ is a crossfade window.

### Buffer Management

$$
\text{Latency} = T_{\text{input\_buffer}} + T_{\text{processing}} + T_{\text{output\_buffer}}
$$

Minimize buffer sizes while ensuring the model can process within one buffer period.

## Benchmarking

### Metrics to Track

| Metric | Definition |
|---|---|
| Latency (p50, p99) | Time from input to output |
| Throughput | Samples generated per second |
| RTF | Real-time factor |
| Memory | Peak GPU/CPU memory usage |
| Quality (FAD) | Audio quality at different speed settings |

### Latency vs. Quality Trade-off

Most optimization techniques sacrifice some quality for speed. Always benchmark both:

```
Speed optimization ──▶ Measure latency reduction
                  ──▶ Measure quality change (FAD, MOS)
                  ──▶ Accept only if quality remains above threshold
```
