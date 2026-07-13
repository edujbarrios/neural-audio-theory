---
sidebar_position: 2
title: Prompt Engineering Guide
---

# Prompt Engineering for AI Music Systems

This guide explains prompt construction from an engineering perspective. A prompt is converted to conditioning embeddings that bias generation trajectories in latent space.

## Conditioning Embeddings

Text prompt tokens are encoded as:

$$
\mathbf{c}=\text{TextEncoder}(\text{prompt})\in\mathbb{R}^d
$$

The conditioning vector $\mathbf{c}$ is injected into the generator (cross-attention, FiLM-like modulation, or concatenative conditioning depending on architecture).

## Why Specific Prompts Work Better

Detailed terms map closer to narrower concept clusters.

- **Specific**: `"120 BPM house groove, side-chained bass, airy female vocal chop"`
- **Vague**: `"electronic song"`

Sharper conditioning reduces output variance:

$$
\operatorname{Var}[x\mid\mathbf{c}_{\text{specific}}]\ll\operatorname{Var}[x\mid\mathbf{c}_{\text{vague}}]
$$

## Structure Tokens and Arrangement Control

Section cues influence state transitions during generation:

$$
\mathbf{h}_{t+1}=f_\theta(\mathbf{h}_t,x_t,\mathbf{s}_{\text{tag}})
$$

Useful tags include intro, verse, chorus, bridge, and outro descriptors.

## Prompt Template (Engineering-Oriented)

Use this order for predictable outputs:

1. **Genre / subgenre**
2. **Tempo and meter**
3. **Instrumentation and production style**
4. **Arrangement structure**
5. **Mix and texture descriptors**

Example:

`Melodic drum and bass, 174 BPM, reese bass, chopped amen break, atmospheric pads, female vocal ad-libs, intro -> build -> drop -> outro, wide stereo, short plate reverb`

## Turn an Idea into a Testable Prompt

Start with a one-sentence brief, then translate each part into a constraint the model can act on.

| Brief question | Prompt constraint | Example |
| --- | --- | --- |
| What style is it? | Genre and subgenre | `melodic drum and bass` |
| How should it move? | Tempo, meter, and groove | `174 BPM, driving breakbeat` |
| What carries the track? | Lead and supporting instruments | `reese bass, atmospheric pads` |
| How should it develop? | Section sequence and contrast | `sparse intro -> full drop -> short outro` |
| How should it feel sonically? | Mix and texture | `wide stereo, controlled low end` |

This translation makes vague goals visible. For example, replace `make the chorus exciting` with `half-time verse -> full-time chorus, doubled drums, brighter synth layer`.

## Resolve Conflicting Constraints

Prompt terms compete for influence. When two instructions imply different arrangements or textures, decide which one is primary instead of asking the model to satisfy both equally.

- Replace `minimal, huge wall of sound` with `minimal verse, dense chorus`.
- Replace `acoustic, heavily processed synth texture` with `acoustic guitar lead over subtle granular ambience`.
- Replace `slow and energetic` with `92 BPM, double-time hi-hats`.

Assigning each descriptor to a section, instrument, or rhythmic layer preserves the creative contrast while removing ambiguity.

## Describe the Vocal Sound

Vocal prompts work best when they describe a few independent dimensions instead of relying on a single label. Most music-generation models can respond to some combination of register, technique, tone, delivery, and role, although exact control varies by model and training data.

### Register and range

| Descriptor | Typical result |
| --- | --- |
| `low register` | Darker, weightier notes near the bottom of the singer's range |
| `mid-register` | Conversational, centered vocal lines |
| `high register` | Bright, elevated melodies with greater intensity |
| `wide vocal range` | Melodies that move between low and high registers |
| `soprano`, `alto`, `tenor`, `baritone`, `bass` | Broad range and color references associated with those voice types |

Voice-type labels are useful directions, not guaranteed biological characteristics or exact pitch boundaries. Add a register or delivery term when the musical result matters more than the singer label.

### Vocal technique

| Descriptor | Typical result |
| --- | --- |
| `chest voice` | Full, direct, speech-connected tone |
| `head voice` | Lighter resonance suited to higher notes |
| `falsetto` | Airy, light high notes with a softer connection |
| `belted vocals` | Strong, projected high-intensity singing |
| `vocal fry` | Rough, creaky texture at the onset or bottom of phrases |
| `vibrato` | Regular pitch movement on sustained notes |
| `straight tone` | Sustained notes with little or no vibrato |
| `melismatic runs` | Several notes sung on one syllable |
| `spoken word` or `rap delivery` | Speech-led rhythm rather than sustained melody |

Avoid stacking techniques that imply competing production goals unless they belong to different sections. For example, use `breathy falsetto verse, belted final chorus` rather than asking for both throughout the song.

### Tone and texture

Useful tone words include `airy`, `breathy`, `warm`, `bright`, `dark`, `smoky`, `husky`, `raspy`, `gritty`, `clear`, `smooth`, `nasal`, and `intimate`. Pair one or two tone words with a technique and register:

`high-register falsetto, airy and intimate tone`

Too many near-synonyms usually add noise rather than precision. Prefer a short hierarchy such as `warm lead vocal with a slight rasp` over a long list of equally weighted adjectives.

### Delivery and performance

Delivery terms describe how the singer shapes phrases and emotion:

- `soft`, `restrained`, or `conversational` for low-intensity passages
- `urgent`, `passionate`, or `anthemic` for stronger projection
- `staccato` for short separated notes; `legato` for connected phrases
- `behind the beat`, `syncopated`, or `rapid-fire` for rhythmic placement
- `close-miked` or `distant` for an implied recording perspective
- `vulnerable`, `confident`, `playful`, or `melancholic` for emotional intent

Anchor emotion to an audible behavior. `Vulnerable, close-miked vocal with restrained dynamics` is more actionable than `emotional singer`.

### Vocal role and arrangement

Specify where the voice sits in the arrangement:

- `solo lead vocal`
- `call-and-response vocals`
- `unison duet` or `contrasting duet`
- `stacked harmonies` or `three-part harmony`
- `choir`, `gang vocals`, or `crowd chant`
- `whispered backing vocals`, `vocal ad-libs`, or `wordless vocal pads`

Roles can also be assigned by section: `solo verse, stacked harmony pre-chorus, choir-backed final chorus`.

## Build a Vocal Prompt

Use this model-agnostic order:

1. **Role**: lead, duet, harmony, choir, or ad-libs
2. **Register or voice type**: low register, high register, alto, tenor, and so on
3. **Technique**: falsetto, belt, straight tone, rap delivery, or another specific behavior
4. **Tone**: one primary quality and, optionally, one modifier
5. **Delivery**: intensity, articulation, rhythm, and emotion
6. **Section assignment**: where the direction begins or changes

Example recipes:

| Goal | Prompt phrase |
| --- | --- |
| Intimate pop verse | `close-miked lead vocal, mid-register, breathy tone, restrained conversational delivery` |
| Lifted pop chorus | `high-register lead, clear belted notes, bright tone, sustained anthemic delivery, stacked backing harmonies` |
| Soulful hook | `warm alto lead, chest voice with controlled rasp, expressive vibrato and short melismatic runs` |
| Dreamy electronic layer | `wordless falsetto vocal pads, airy tone, long legato phrases, distant reverb` |
| Rhythmic verse | `low-register rap delivery, dry close vocal, precise syncopated phrasing, occasional whispered doubles` |
| Dramatic finale | `wide-range lead vocal, rising from soft head voice to a strong belt, choir-backed final chorus` |

:::note Model behavior varies
These terms are conditioning cues, not exact controls. A model may ignore, blend, or reinterpret them. Test one vocal change at a time, and preserve the seed and settings when the platform exposes them.
:::

### Keep requests coherent

- Use two to four strong vocal descriptors before adding more detail.
- Assign contrasting techniques to different sections.
- Match the technique to the likely register: for example, `high falsetto` or `mid-to-high belt`.
- Describe backing vocals separately from the lead.
- State whether vocal effects are part of the performance or the mix, such as `raspy lead vocal` versus `clean lead through telephone filtering`.
- Avoid naming a living singer as a shortcut; describe the audible qualities you want instead.

When a result misses the target, revise the vocal phrase before rewriting the entire music prompt. Change one dimension—register, technique, tone, delivery, or arrangement role—and compare a consistent batch of outputs.

## Run Controlled Prompt Experiments

Treat each revision as a small experiment:

1. Save a baseline prompt and its strongest output.
2. Choose one variable to test, such as groove, instrumentation, structure, or mix language.
3. Keep the seed and generation settings fixed when the system exposes them.
4. Generate the same number of candidates for the baseline and revision.
5. Compare the outputs against a short rubric instead of relying on memory.

| Criterion | Question |
| --- | --- |
| Style match | Does the output stay inside the intended genre and era? |
| Structure | Are sections distinct and ordered as requested? |
| Groove | Do tempo, meter, and rhythmic feel match the brief? |
| Timbre | Are the requested sound sources recognizable? |
| Mix direction | Is the density, space, and stereo character appropriate? |

Record the prompt, settings, candidate count, and result. If a revision improves one criterion but damages another, keep the useful phrase and narrow its scope in the next prompt.

:::tip Keep a prompt changelog
Write one sentence per revision: `Changed X because Y; result Z.` This is enough to reproduce successful decisions without creating heavy project documentation.
:::

## Practical Guidance

- Lead with style and tempo constraints
- Use concrete instrument/production terms
- Add structure explicitly
- Keep descriptors consistent (avoid conflicting tags)
- Iterate with small prompt edits and compare outputs
- Preserve generation settings during comparisons when possible
- Score results against the same short rubric

Prompt quality improves control, but dataset scope and model architecture still bound what can be generated.
