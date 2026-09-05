---
sidebar_position: 1
title: Copyright & Training Data
---

# Copyright and Training Data

AI music raises separate questions about training inputs, generated outputs, contractual rights, and infringement. Those questions are jurisdiction-specific and change over time, so this page distinguishes documented law and policy from unresolved issues.

:::info Checked 5 September 2026

The legal summaries below were checked against primary or official sources, including the EU DSM Directive, UK Intellectual Property Office guidance, and the U.S. Copyright Office's AI reports. This is educational information, not legal advice.

:::

## Keep four questions separate

1. **Training permission** — may a developer copy or analyze protected works for model training?
2. **Output copyrightability** — does copyright subsist in a generated work, and who is the author?
3. **Output infringement** — does a particular output copy protectable expression from an existing work?
4. **Platform contract rights** — what does a provider's current agreement let a user do with an output?

A contractual permission to monetize an output is not the same thing as copyright ownership, and copyrightability does not guarantee that an output is non-infringing.

## Training data rights

There is no single global rule that makes copyrighted music lawful or unlawful to use for machine learning. The result can depend on the jurisdiction, the source of the material, lawful access, contractual restrictions, statutory exceptions, rights reservations, and the facts of the particular use.

### Selected legal frameworks

| Jurisdiction | What the primary sources support |
| --- | --- |
| **United States** | Fair use is a case-specific statutory defense. The U.S. Copyright Office's 2025 AI training report describes unresolved policy and legal questions; outcomes cannot safely be reduced to a rule that all AI training is or is not fair use. AI-music litigation remains relevant to this area. |
| **European Union** | DSM Directive Article 3 creates a TDM exception for research organisations and cultural-heritage institutions conducting scientific research on works to which they have lawful access. Article 4 separately creates a broader TDM exception for lawfully accessible works, but it does not apply where rightholders have expressly reserved the relevant rights in an appropriate manner; for publicly available online content, the Directive identifies machine-readable means as appropriate. |
| **United Kingdom** | The current statutory TDM exception described by the UK Intellectual Property Office applies to computational analysis for **non-commercial research** where the researcher already has lawful access. Do not describe current UK law as a general commercial-training exception. |
| **Other jurisdictions** | Rules differ materially. Check the current statute, implementing guidance, and relevant case law rather than extrapolating from the US, EU, or UK. |

### EU rights reservations

Do not treat `robots.txt` as a universal copyright switch. Under Article 4 of the EU DSM Directive, the relevant question is whether the rightholder has expressly reserved TDM rights in an appropriate manner. For content publicly available online, the Directive specifically points to machine-readable means, including metadata and website/service terms.

For an engineering ingestion pipeline, preserve:

- source URL or acquisition record;
- date and basis of lawful access;
- applicable licence or contract version;
- machine-readable rights metadata and relevant site terms;
- any opt-out or rights-reservation signal observed at ingestion time;
- dataset-level provenance and removal records.

## Output copyrightability

Copyrightability is distinct from ownership language in a provider's terms.

### United States

The U.S. Copyright Office's January 2025 report states that generative-AI outputs can be protected only where a human author has determined sufficient expressive elements. Human-authored material perceptible in an output, or sufficiently creative human selection, arrangement, or modification, can be protected. Mere prompting, by itself, is not enough under the Office's analysis.

That means "AI-assisted" and "AI-generated" are not binary legal categories. Preserve the human-authored contributions that matter: lyrics, composition, recordings, arrangement decisions, edits, and other expressive changes.

### Provider rights are contractual

A provider can grant or assign contractual rights even when copyright does not vest in an output. Read the current terms for the account tier and for the specific asset.

For example, Suno's current terms distinguish free/basic outputs from outputs generated under paid tiers. Paid-tier terms can grant ownership or commercial-use rights subject to the contract, while Suno expressly warns that it does not guarantee that copyright subsists in an output. Free/basic outputs are restricted to personal, non-commercial use under the current terms. Treat those rules as versioned contract terms, not universal copyright law.

Do not generalize one provider's rules to another provider, and do not describe Suno and Udio collectively as simply "royalty-free" without checking each service's current agreement.

## Output infringement

An AI-generated work can still create infringement risk. The relevant legal test is jurisdiction-specific and depends on protectable expression, copying, access/inference rules, defences, and the facts of the case.

Avoid universal statements such as "melody is protectable but rhythm and timbre are not." Musical copyright analysis is more contextual than a fixed ranking of musical attributes, and sound recordings can also carry separate rights from the underlying composition.

For release review, ask:

- Does the output reproduce recognizable lyrics, melody, arrangement, or recorded material from a known work?
- Does it contain a recognizable sample or recording fragment?
- Was copyrighted source audio uploaded or used as conditioning material, and under what rights?
- Are there contractual restrictions on prompts, remixes, extensions, or downloaded assets?
- Does a distributor or platform impose additional rules beyond copyright law?

## Memorization and similarity

Models can reproduce or closely approximate training examples under some conditions, but the likelihood is model- and dataset-dependent. Do not present popularity, temperature, guidance scale, or any single training characteristic as a universal predictor of memorization without evidence for the model being discussed.

Useful engineering checks include:

| Check | Purpose |
| --- | --- |
| Exact and near-duplicate detection | Detect training/test leakage and repeated source files |
| Audio fingerprinting | Find exact or transformation-resistant recording matches |
| Melody / embedding retrieval | Surface candidates for closer human review; not a legal infringement test |
| Canary or extraction tests | Measure memorization risk under a defined evaluation protocol |
| Human rights review | Evaluate flagged material in context before release |

A fingerprint or embedding threshold is an engineering signal, not a legal conclusion about substantial similarity.

## Style, voice, and likeness

Copyright does not generally give a monopoly over an abstract artistic style, but "style imitation" can intersect with other rights and laws: trademark or passing off, unfair competition, publicity/personality rights, false endorsement, contractual restrictions, and rights in particular lyrics, compositions, recordings, or voice performances.

Accordingly, avoid telling users that artist imitation is either always lawful or always copyright infringement. For commercial releases, evaluate the concrete output, marketing, naming, voice likeness, and source material.

## Practical release checklist

1. Record the generator, model/version shown by the service, account tier, and generation date.
2. Keep the provider terms and rights page reviewed for the release.
3. Preserve prompts, uploaded inputs, lyrics, edits, and material human-authored contributions.
4. Confirm that every uploaded or conditioned source was lawfully usable for the intended purpose.
5. Run similarity and fingerprint checks where risk justifies them, then review matches manually.
6. Do not equate commercial-use permission with copyright registration eligibility.
7. Review distributor, label, collecting-society, and platform rules separately.
8. Obtain qualified legal advice for high-value releases, disputes, voice-likeness issues, or uncertain source rights.

## Primary and official sources

Checked 5 September 2026:

- [EU Directive 2019/790, Articles 3 and 4](https://eur-lex.europa.eu/eli/dir/2019/790/oj)
- [UK IPO: Exceptions to copyright — text and data mining for non-commercial research](https://www.gov.uk/guidance/exceptions-to-copyright)
- [U.S. Copyright Office: Copyright and Artificial Intelligence](https://www.copyright.gov/policy/artificial-intelligence/)
- [U.S. Copyright Office Part 2 announcement: Copyrightability](https://www.copyright.gov/newsnet/2025/1060.html)
- [Suno Terms of Service](https://suno.com/terms-of-service)
- [Suno Help: Rights & Ownership](https://help.suno.com/en/categories/550145)

Because legislation, litigation, and provider contracts change, re-check these sources for any production decision that depends on them.
