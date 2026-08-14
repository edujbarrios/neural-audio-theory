---
sidebar_position: 4
title: Real-Time Inference
---

# Real-Time Audio Inference

“Real time” is a deadline, not a synonym for fast. An audio system must produce each block before playback consumes it, while also meeting startup latency, tail latency, memory, and quality requirements. A model can average faster than playback and still glitch because its worst-case block misses the deadline.

## Define the contract

For sample rate $f_s$ and callback block size $B$, the device period is

$$
T_{\mathrm{block}}=\frac{B}{f_s}.
$$

At 48 kHz, 256 samples provide about 5.33 ms. Compute scheduled in the audio callback must finish comfortably inside that period; synchronization, memory allocation, data transfer, and competing workloads consume part of the budget.

Distinguish these measurements:

| Measurement | Meaning |
| --- | --- |
| algorithmic delay | required future context plus analysis/synthesis delay |
| startup latency | request or input start to first playable output |
| block latency | processing time for one streaming block |
| end-to-end latency | capture, buffering, compute, transport, and playback |
| throughput | audio seconds produced per wall-clock second |
| real-time factor (RTF) | wall-clock processing time divided by audio duration; lower than 1 is faster than real time |

Some publications define the reciprocal as a “speed factor.” Always give the equation with the number.

## Budget the whole path

$$
T_{\mathrm{e2e}}=T_{\mathrm{capture}}+T_{\mathrm{lookahead}}+T_{\mathrm{queue}}+T_{\mathrm{transfer}}+T_{\mathrm{model}}+T_{\mathrm{decode}}+T_{\mathrm{playback}}.
$$

Measure timestamps at component boundaries. Host-to-device copies, resampling, codec frames, network jitter buffers, and output crossfades are common hidden costs. Report warm and cold starts separately.

## Causality and receptive field

A causal layer uses only current and past inputs. A system is not causal merely because it emits chunks: centered convolutions, bidirectional attention, normalization over a full clip, or a non-causal codec can introduce future context.

For a stack of causal convolutions with kernel sizes $k_i$ and dilations $d_i$, the receptive field in samples is

$$
R=1+\sum_i (k_i-1)d_i
$$

when stride is one. Strides and multirate stages require propagating the jump between layers. State exactly which past activations are cached at chunk boundaries.

## Streaming state

Streaming implementations should carry state rather than recompute the entire prefix:

- convolution tails for causal encoders and decoders;
- key/value caches for autoregressive or chunked-attention models;
- phase or overlap state for STFT-based transforms;
- resampler state and loudness meter state;
- random-number state when generation must be reproducible.

Bound cache growth. Global attention over an unbounded stream eventually violates both latency and memory budgets; use a sliding window, compressed memory, or explicit reset policy.

## Chunk boundaries

Overlap-add can blend compatible frames,

$$
y[n]=\sum_m w[n-mH]y_m[n-mH],
$$

but it cannot repair inconsistent pitch, phase, or musical state across independently generated chunks. Use conditioning overlap, persistent model state, and boundary-aware training. Validate the constant-overlap-add property of the chosen window and hop, and avoid applying a second unintended gain envelope.

## Optimization order

1. **Profile the deployed graph.** Include preprocessing, transfers, decoding, and synchronization.
2. **Remove avoidable work.** Cache state, fuse operations, preallocate buffers, and eliminate format conversions.
3. **Choose efficient shapes.** Static shapes and hardware-friendly channel sizes often matter more than theoretical FLOPs.
4. **Reduce precision carefully.** Validate weights, activations, accumulators, and sensitive output layers separately.
5. **Reduce model work.** Distill, prune structurally, shorten context, or reduce diffusion evaluations.
6. **Change architecture if necessary.** A non-causal, full-context model cannot be converted into a low-delay instrument by export tooling alone.

Quantization speedups depend on kernel and hardware support. INT8 can be slower than FP16 when it triggers dequantization or unsupported operators. Report measured latency and quality; do not infer either from bytes per parameter.

## Model-family considerations

### Autoregressive token models

Cache keys and values, but include the cost of predicting every codebook stream and decoding tokens. Sampling and synchronization can dominate small matrix operations. Delayed or parallel codebook patterns trade dependency modeling against token latency.

### Diffusion and flow models

Latency is roughly the number of neural function evaluations multiplied by denoiser cost, plus conditioning and decoding. Guidance may require an additional conditional/unconditional pass unless batched or distilled. Fewer solver steps do not guarantee equal quality, and one-step generation does not guarantee a small model.

### Vocoders and codecs

Measure algorithmic delay separately from throughput. A decoder may be very fast after it receives a large latent window. Test impulse response, chunk boundaries, stereo behavior, and sustained tones in causal mode.

## Benchmark harness

Benchmark the same artifact that ships, after warm-up, under a controlled power and concurrency setting. Record:

- CPU/GPU/accelerator model, runtime, driver, precision, and thread counts;
- batch size, input/output duration, chunk size, and lookahead;
- cold start, time to first audio, steady-state p50/p95/p99 block time;
- deadline misses and longest consecutive underrun;
- peak device and host memory;
- audio quality at the exact optimized operating point.

Use a long stream and inject realistic competing load. Average RTF alone hides deadline misses. For network services, add queue time, transport, jitter, cancellation, and backpressure behavior.

## Production checklist

- The callback path performs no allocation, logging, file I/O, or blocking lock acquisition.
- Ring buffers have explicit overflow and underflow policies.
- State resets are click-free and tested after device or sample-rate changes.
- Overload degrades predictably by bypassing, reducing quality, or increasing buffer size.
- Telemetry captures tail latency and underruns without blocking audio.
- The benchmark is repeated on minimum supported hardware.
- Quality evaluation uses outputs from the optimized runtime, not the original training framework.

## Related reading

- [Neural Audio Codecs](../concepts/neural-audio-codecs.md)
- [Benchmark Design](../training/benchmark-design.md)
- [Evaluation Metrics](../training/evaluation-metrics.md)
