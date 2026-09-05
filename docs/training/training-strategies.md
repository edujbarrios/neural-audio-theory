---
sidebar_position: 3
title: Training Strategies
---

# Training Strategies for Audio Models

Training behavior depends on architecture, objective, data, optimizer, precision, hardware, and distributed strategy. This page describes common tools without presenting one recipe or hyperparameter set as universal for audio models.

## Learning-rate schedules

### Warm-up

A linear warm-up can be written as

$$
\eta_t=\eta_{\max}\frac{t}{N_{\mathrm{warmup}}},\qquad t\le N_{\mathrm{warmup}}.
$$

Warm-up is often used to avoid large early updates, especially in transformer training, but its necessity and duration are empirical choices rather than fixed requirements.

### Cosine decay

One common schedule is

$$
\eta_t=\eta_{\min}+\frac12(\eta_{\max}-\eta_{\min})\left(1+\cos\frac{\pi t}{T}\right).
$$

Cosine schedules are widely used, but claims that they inherently produce better final performance than step decay require a controlled comparison on the target task.

### Inverse-square-root schedules

Transformer systems sometimes use schedules proportional to $t^{-1/2}$ after warm-up. The exact normalization varies by implementation, so copy the formula from the code or paper being reproduced.

## Optimizers

### Adam and AdamW

Adam maintains exponential moving averages of first and second gradient moments. AdamW modifies Adam by decoupling weight decay from the loss-gradient update. The AdamW paper demonstrated benefits in the authors' experiments; this should not be generalized into a guarantee that AdamW always improves generalization.

Default values such as $\beta_1=0.9$, $\beta_2=0.999$, and $\epsilon=10^{-8}$ are common library defaults, not audio-specific laws. Weight decay, betas, learning rate, and epsilon should be reported with each experiment.

Other optimizers such as Adafactor, Lion, LAMB, or second-order approximations may be useful under particular memory or scaling constraints. Their inclusion in a library does not establish superiority for audio.

## Mixed precision

Frameworks such as PyTorch AMP can execute selected operations in lower precision while keeping other operations in FP32. `float16` and `bfloat16` have different numerical properties and hardware support.

Mixed precision **can** reduce memory use or increase throughput when the accelerator has efficient lower-precision kernels. Fixed statements such as “50% less memory” or “2–3× faster” are hardware-, model-, batch-, and kernel-dependent and should be measured rather than assumed.

For FP16 training, gradient scaling is commonly used to reduce underflow risk. BF16 has the same exponent width as FP32 and therefore a wider dynamic range than FP16, but it has fewer fraction bits than FP32. Whether BF16 is preferable depends on accelerator support and model behavior.

Record:

- compute dtype and parameter/master-weight dtype;
- whether gradient scaling is enabled;
- framework and accelerator generation;
- throughput, memory peak, and any convergence change versus FP32.

## Gradient accumulation

Accumulating gradients over $K$ micro-batches can approximate a larger effective batch:

$$
g_{\mathrm{acc}}=\frac1K\sum_{k=1}^{K}g_k.
$$

The often-quoted effective batch size

$$
B_{\mathrm{eff}}=B_{\mathrm{micro}}\times K\times N_{\mathrm{data\ parallel\ ranks}}
$$

is useful bookkeeping, but accumulation is not automatically identical to a single large-batch update. Differences can arise from batch-normalization statistics, stochastic layers, loss reduction, gradient clipping, optimizer/scheduler step timing, sequence packing, and stateful model components.

## Distributed training

### Distributed Data Parallel (DDP)

In replicated data parallelism, each rank holds model parameters, processes different data, and synchronizes gradients. PyTorch DDP uses collective communication for synchronization. It is a common baseline, but avoid claiming it is the most common strategy across all audio training.

### Fully Sharded Data Parallel (FSDP)

PyTorch FSDP can shard parameters, gradients, and optimizer states depending on the selected sharding strategy. Full sharding reduces per-rank memory relative to full replication but introduces all-gather/reduce-scatter communication. Whether this raises or lowers end-to-end training time depends on model size, network topology, wrapping policy, overlap, and batch size.

### Tensor, pipeline, and other model parallelism

Very large models may use tensor parallelism, pipeline parallelism, sharded data parallelism, activation checkpointing, CPU/NVMe offload, or combinations of these. A parameter count alone does not establish which method is “necessary.”

## Gradient clipping

Norm clipping can limit an update when a gradient norm exceeds threshold $c$:

$$
g'=g\min\left(1,\frac{c}{\|g\|}\right).
$$

A max norm such as 1.0 is a common starting value in some transformer recipes, not a universal audio setting. Under sharded training, use the framework's sharding-aware clipping API when required.

## Exponential moving averages

An EMA of parameters has the form

$$
\theta_{\mathrm{EMA}}\leftarrow\beta\theta_{\mathrm{EMA}}+(1-\beta)\theta.
$$

EMA is useful in some diffusion and generative-model recipes, but not every architecture benefits from it and no single $\beta$ is generally correct. Evaluate EMA and non-EMA checkpoints on the same validation protocol before selecting one.

## Batch size and learning-rate scaling

There are no universal “small / medium / large” batch-size bands for audio. A batch of 16 long stereo waveforms may consume more memory and represent more tokens than thousands of short symbolic sequences.

Report batch size in units relevant to the model, for example:

- clips and seconds of audio per optimizer step;
- codec tokens or frames per step;
- sequence length distribution;
- number of data-parallel ranks;
- gradient-accumulation steps.

The linear scaling rule, $\eta'=k\eta$, originated as a useful heuristic in large-batch vision training. It is not guaranteed to hold for a new audio model; verify stability and validation performance after changing global batch size.

## Staged training

Pretraining followed by task/domain adaptation is common across modern machine learning, but there is no universal three-stage sequence of “pretrain → fine-tune → RLHF” for audio. Music and audio systems may instead train codecs separately, freeze encoders, perform supervised fine-tuning, preference tuning, distillation, adversarial stages, or joint end-to-end training.

Describe stages by the actual objective and data rather than labeling an undocumented phase “alignment.”

## Curriculum learning

Curriculum learning deliberately changes the training-data distribution or task difficulty over time. Published work shows benefits in some settings and no guaranteed improvement in others. If using a curriculum, define the ordering signal, schedule, baseline without curriculum, and effect on convergence and held-out quality.

## Checkpointing and exact resumption

A reproducible checkpoint may need more than model and optimizer tensors. Depending on the stack, save:

- model and optimizer states;
- scheduler and gradient-scaler states;
- EMA state if used;
- global step/epoch and sampler state;
- random-number generator states;
- data-shard position where practical;
- model/config and dependency versions.

Saving every fixed number of steps is one policy, not a requirement. Choose cadence from checkpoint cost, failure rate, and acceptable lost work.

## Monitoring

Useful signals depend on the model. Typical examples include training/validation objectives, gradient norms, learning rate, throughput, memory peaks, numerical overflows, data-loader stalls, and task-specific validation metrics.

Do not label FAD, CLAP similarity, discriminator accuracy, or any other single metric as an unconditional “audio quality” monitor. Each metric has a defined scope and failure modes; use the evaluation protocol described in [Evaluation Metrics](./evaluation-metrics.md).

## Primary references and documentation

- Loshchilov & Hutter, [Decoupled Weight Decay Regularization](https://arxiv.org/abs/1711.05101) (AdamW).
- PyTorch, [Automatic Mixed Precision documentation](https://docs.pytorch.org/docs/stable/amp.html).
- PyTorch, [FullyShardedDataParallel documentation](https://docs.pytorch.org/docs/stable/fsdp.html).
- Goyal et al., [Accurate, Large Minibatch SGD: Training ImageNet in 1 Hour](https://arxiv.org/abs/1706.02677) (linear-scaling rule context).

Sources checked: 2026-09-05.
