---
sidebar_position: 3
title: Fine-Tuning & Adaptation
---

# Fine-Tuning and Adaptation for Audio Models

Pre-trained audio models can be adapted to specific styles, instruments, artists, or use cases through fine-tuning. This page covers the practical techniques for customizing audio AI models.

## Why Fine-Tune?

Pre-trained models are general-purpose. Fine-tuning specializes them:

| Goal | Example |
|---|---|
| Genre specialization | Fine-tune for jazz or classical |
| Instrument focus | Specialize in guitar or piano |
| Style matching | Match a specific production aesthetic |
| Language/accent | Adapt singing voice to a specific language |
| Quality improvement | Fine-tune on curated high-quality data |
| Task adaptation | Adapt generation model for editing or inpainting |

## Full Fine-Tuning

Update all model parameters on new data:

$$
\theta^* = \arg\min_\theta \mathcal{L}(\theta; \mathcal{D}_{\text{finetune}})
$$

### When to Use

- Sufficient fine-tuning data available (hundreds to thousands of examples)
- Significant domain shift from pre-training data
- Compute budget allows full training

### Risks

- **Catastrophic forgetting**: model loses general capabilities
- **Overfitting**: memorizes small fine-tuning dataset
- **Compute cost**: same as pre-training per step

### Mitigation

- **Lower learning rate**: 10–100× smaller than pre-training ($10^{-5}$ to $10^{-6}$)
- **Short training**: fewer epochs (5–50)
- **Regularization**: weight decay, dropout, early stopping
- **Data augmentation**: expand small datasets (see [Data Augmentation](../training/data-augmentation.md))

## Parameter-Efficient Fine-Tuning (PEFT)

Update only a small fraction of parameters while freezing the rest.

### LoRA (Low-Rank Adaptation)

The most popular PEFT technique. Decomposes weight updates as low-rank matrices:

$$
W' = W + \Delta W = W + BA
$$

where $B \in \mathbb{R}^{d \times r}$, $A \in \mathbb{R}^{r \times k}$, and $r \ll \min(d, k)$.

**During training**: freeze $W$, only train $A$ and $B$.

**Parameter savings**:

$$
\text{LoRA params} = r \times (d + k) \ll d \times k = \text{Full params}
$$

For $r = 16$, $d = k = 1024$: LoRA uses 32K parameters vs. 1M for full matrix — 32× fewer.

### LoRA for Audio

Apply LoRA to attention layers:

$$
Q = xW_Q + x(B_Q A_Q), \quad K = xW_K + x(B_K A_K), \quad V = xW_V + x(B_V A_V)
$$

| LoRA Rank ($r$) | Quality | Params Added | Use Case |
|---|---|---|---|
| 4 | Modest adaptation | Very few | Subtle style shifts |
| 16 | Good adaptation | Few | Genre/instrument focus |
| 64 | Strong adaptation | Moderate | Significant domain change |
| 128+ | Near full fine-tune | Many | Maximum flexibility |

### QLoRA

Combine LoRA with quantization for memory efficiency:

1. Quantize pre-trained model to 4-bit (NF4 quantization)
2. Add LoRA adapters in full precision
3. Train only the adapters

This allows fine-tuning large models on consumer GPUs:
- 3.3B parameter model: ~8 GB VRAM with QLoRA
- vs. ~26 GB for full fine-tuning in FP16

### Adapters

Insert small trainable modules between frozen layers:

$$
h' = h + f_{\text{adapter}}(h)
$$

where $f_{\text{adapter}}$ is a small feedforward network (e.g., down-project → nonlinearity → up-project).

$$
f_{\text{adapter}}(h) = W_{\text{up}} \cdot \text{ReLU}(W_{\text{down}} \cdot h)
$$

with $W_{\text{down}} \in \mathbb{R}^{r \times d}$ and $W_{\text{up}} \in \mathbb{R}^{d \times r}$.

### Prefix Tuning

Prepend learnable "prefix" tokens to the input:

$$
\text{input}' = [\mathbf{p}_1, \mathbf{p}_2, \dots, \mathbf{p}_L, x_1, x_2, \dots, x_T]
$$

The prefix tokens act as a task-specific prompt that's optimized through gradient descent.

## Textual Inversion

Learn new "concepts" represented as text tokens:

$$
\mathbf{v}^* = \arg\min_{\mathbf{v}} \mathcal{L}(G(x, \mathbf{c}_{\text{with\_v}}); \mathcal{D}_{\text{concept}})
$$

For audio: learn a new text embedding for a specific instrument, vocalist, or production style. The new token can then be used in prompts alongside regular text.

Example: train a token `[my_guitar]` on recordings of a specific guitar, then prompt: "Jazz melody with `[my_guitar]`, gentle drums, upright bass."

## DreamBooth for Audio

Fine-tune the entire model while associating a rare token with a specific concept:

1. Pick a rare token (e.g., `[V]`)
2. Fine-tune on examples of the target concept labeled with `[V]`
3. Use `[V]` in prompts to invoke the learned concept

**With prior preservation**: also train on general data to prevent forgetting:

$$
\mathcal{L} = \mathcal{L}_{\text{concept}} + \lambda \mathcal{L}_{\text{prior}}
$$

## Fine-Tuning Recipes

### Recipe 1: Genre Specialization with LoRA

```
1. Collect 100–1000 high-quality tracks in target genre
2. Segment into 10–30 second clips
3. Annotate with descriptive captions
4. Fine-tune with LoRA (r=32) on attention layers
5. Use AdamW, lr=1e-4, 500–2000 steps
6. Evaluate with genre-specific FAD and human listening
```

### Recipe 2: Voice Adaptation

```
1. Collect 5–30 minutes of target voice recordings
2. Ensure clean, unaccompanied recordings
3. Extract speaker embedding as conditioning
4. Fine-tune decoder/vocoder with LoRA
5. Use lr=1e-5, 200–1000 steps
6. Evaluate with MOS and speaker similarity
```

### Recipe 3: Production Style Transfer

```
1. Collect 50–200 tracks with target production style
2. Include diverse musical content within the style
3. Caption with style-specific descriptors
4. Fine-tune with LoRA (r=16) for 300–1000 steps
5. Use textual inversion for style token
6. Evaluate A/B against base model
```

## Training Data Requirements

| Technique | Minimum Data | Best Data | Quality Sensitivity |
|---|---|---|---|
| Full fine-tuning | 500+ tracks | 5000+ | Moderate |
| LoRA | 50–200 tracks | 500+ | High |
| Textual inversion | 10–50 examples | 50–100 | Very high |
| DreamBooth | 10–30 examples | 30–100 | Very high |

Data quality matters more than quantity for fine-tuning. A small set of excellent examples outperforms a large set of mediocre ones.

## Common Pitfalls

| Pitfall | Symptom | Fix |
|---|---|---|
| Learning rate too high | Quality collapses quickly | Reduce LR 10× |
| Training too long | Outputs all sound the same | Stop earlier, use validation |
| Data too homogeneous | Model overfits to specific patterns | Add diversity |
| Catastrophic forgetting | Loses general capability | Use LoRA, lower LR, or replay |
| Captions too generic | Adapter doesn't specialize | Write detailed, specific captions |

## Serving Fine-Tuned Models

### LoRA Weight Merging

For deployment, merge LoRA weights into the base model:

$$
W_{\text{merged}} = W + BA
$$

This produces a standard model with no inference overhead.

### Multiple LoRA Switching

Serve the base model with swappable LoRA adapters:

```
Base Model + LoRA_jazz ──▶ Jazz output
Base Model + LoRA_classical ──▶ Classical output
Base Model + LoRA_electronic ──▶ Electronic output
```

Only the small adapter weights change, not the full model.

### LoRA Interpolation

Blend between styles:

$$
\Delta W = \alpha \cdot B_A A_A + (1-\alpha) \cdot B_B A_B
$$

where $\alpha \in [0, 1]$ interpolates between two fine-tuned styles.
