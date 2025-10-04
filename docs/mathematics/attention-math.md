---
sidebar_position: 4
title: Attention Mathematics
---

# Attention Mathematics

Attention mechanisms are the computational foundation of transformers, and transformers are the dominant architecture in modern music AI. This page covers the mathematics of attention in depth.

## Scaled Dot-Product Attention

The basic attention operation:

$$
\text{Attention}(Q, K, V) = \text{softmax}\left(\frac{QK^\top}{\sqrt{d_k}}\right)V
$$

where:
- $Q \in \mathbb{R}^{n \times d_k}$ — queries
- $K \in \mathbb{R}^{m \times d_k}$ — keys
- $V \in \mathbb{R}^{m \times d_v}$ — values
- $d_k$ — key dimension (scaling factor)

### Step by Step

**1. Compute attention scores:**

$$
S = QK^\top \in \mathbb{R}^{n \times m}
$$

Each entry $S_{ij}$ measures the relevance of key $j$ to query $i$.

**2. Scale:**

$$
S' = \frac{S}{\sqrt{d_k}}
$$

Scaling prevents softmax saturation. Without it, large $d_k$ produces extreme dot products, causing softmax to output near-one-hot distributions with vanishing gradients.

**3. Softmax normalization:**

$$
A_{ij} = \frac{\exp(S'_{ij})}{\sum_{j'=1}^{m} \exp(S'_{ij'})}
$$

Each row of $A$ sums to 1, forming a probability distribution over keys.

**4. Weighted combination:**

$$
\text{Output}_i = \sum_{j=1}^{m} A_{ij} V_j
$$

Each output is a weighted mixture of values, with weights determined by query-key similarity.

## Multi-Head Attention

Instead of a single attention function, use $h$ parallel heads with different learned projections:

$$
\text{head}_i = \text{Attention}(QW_i^Q, KW_i^K, VW_i^V)
$$

$$
\text{MultiHead}(Q, K, V) = \text{Concat}(\text{head}_1, \dots, \text{head}_h) W^O
$$

where $W_i^Q \in \mathbb{R}^{d_{\text{model}} \times d_k}$, $W_i^K \in \mathbb{R}^{d_{\text{model}} \times d_k}$, $W_i^V \in \mathbb{R}^{d_{\text{model}} \times d_v}$, and $W^O \in \mathbb{R}^{hd_v \times d_{\text{model}}}$.

Typically $d_k = d_v = d_{\text{model}} / h$.

### Why Multiple Heads?

In music contexts, different heads learn to attend to different aspects:
- Head A: rhythmic patterns (attend to same beat positions)
- Head B: harmonic relationships (attend to consonant pitch patterns)
- Head C: local context (attend to nearby tokens)
- Head D: structural repeats (attend to similar sections)

## Self-Attention vs. Cross-Attention

### Self-Attention

$Q$, $K$, $V$ all come from the same sequence:

$$
Q = XW^Q, \quad K = XW^K, \quad V = XW^V
$$

Used for modeling dependencies within the audio token sequence.

### Cross-Attention

$Q$ comes from one sequence (audio), $K$ and $V$ from another (text):

$$
Q = X_{\text{audio}}W^Q, \quad K = X_{\text{text}}W^K, \quad V = X_{\text{text}}W^V
$$

Cross-attention is how text conditioning is injected into audio generation. Each audio token "looks at" the text embeddings to decide what to generate.

## Computational Complexity

Standard self-attention has complexity:

$$
O(T^2 \cdot d)
$$

where $T$ is sequence length and $d$ is model dimension.

For music at 50 tokens/sec, a 30-second clip has $T = 1500$ tokens. The attention matrix has $1500^2 = 2.25M$ entries — manageable.

For raw audio at 24 kHz, a 30-second clip has $T = 720{,}000$ tokens. Standard attention is infeasible.

## Efficient Attention Mechanisms

### Causal (Autoregressive) Masking

For autoregressive generation, mask future positions:

$$
A_{ij} = \begin{cases} \text{softmax}(S'_{ij}) & j \leq i \\ 0 & j > i \end{cases}
$$

Implemented by setting masked positions to $-\infty$ before softmax.

### Sliding Window (Local) Attention

Restrict attention to a local window of size $w$:

$$
A_{ij} = 0 \quad \text{if} \quad |i - j| > w/2
$$

Complexity: $O(T \cdot w \cdot d)$ — linear in sequence length.

Used in Mistral and some audio models for efficiency.

### Sparse Attention Patterns

Combine local and strided attention:

$$
\mathcal{N}(i) = \{j : |i-j| \leq w\} \cup \{j : j \bmod s = 0\}
$$

Jukebox uses this pattern. Complexity: $O(T \sqrt{T})$.

### Flash Attention

An IO-aware implementation that computes exact attention without materializing the full $T \times T$ matrix:

- Tiles the computation to fit in SRAM
- Fuses softmax, masking, and matrix multiply
- 2–4× speedup with identical numerical results
- Standard in modern frameworks (PyTorch, JAX)

Not an approximation — same result, just faster.

### Linear Attention

Replace softmax with a kernel approximation:

$$
\text{Attention}(Q, K, V) \approx \phi(Q)(\phi(K)^\top V)
$$

where $\phi$ is a feature map. Complexity: $O(T \cdot d^2)$ — linear in $T$.

Examples: Performer, Random Feature Attention. Quality trade-offs exist.

## Positional Encoding

Attention is permutation-invariant by default. Positional information must be added explicitly.

### Sinusoidal Encoding (Original Transformer)

$$
PE(pos, 2i) = \sin\left(\frac{pos}{10000^{2i/d}}\right)
$$

$$
PE(pos, 2i+1) = \cos\left(\frac{pos}{10000^{2i/d}}\right)
$$

### Rotary Position Embeddings (RoPE)

Encode relative position by rotating query and key vectors:

$$
\tilde{q}_m = R_\Theta^m q_m, \quad \tilde{k}_n = R_\Theta^n k_n
$$

where $R_\Theta^m$ is a rotation matrix. The dot product $\tilde{q}_m^\top \tilde{k}_n$ depends only on relative position $(m-n)$.

RoPE is now dominant in language models and increasingly used in audio transformers.

### Relative Position Bias

Add a learned or computed bias based on relative position:

$$
S_{ij} = q_i^\top k_j + b_{i-j}
$$

Used in T5 and some audio models. ALiBi is a linear variant:

$$
S_{ij} = q_i^\top k_j - m \cdot |i - j|
$$

where $m$ is a head-specific slope.

## Attention in Audio: Practical Considerations

| Design Choice | Recommendation for Audio |
|---|---|
| Positional encoding | RoPE or relative bias |
| Attention type | Causal for AR models, bidirectional for encoders |
| Number of heads | 8–32 (scale with model size) |
| Head dimension | 64–128 |
| Flash Attention | Always enable when available |
| Window size | At least 2–4 seconds of audio tokens |

## The Attention Map as a Musical Analysis Tool

Attention patterns in trained audio models reveal learned musical structure:

- **Diagonal patterns**: local temporal dependencies
- **Vertical stripes**: globally important tokens (structural boundaries)
- **Periodic patterns**: rhythmic/metric structure (every 4 bars, every beat)
- **Block patterns**: section-level attention (verse attending to verse)

Visualizing attention maps is a valuable debugging and interpretability tool for music AI researchers.
