---
layout: default
title: Notes
---

# Measure-Theoretic Probability Notes

---

# Families

<div class="definition" data-title="Definition: σ-algebra">
A $\sigma$-algebra on a set $\Omega$ is a collection of subsets of $\Omega$ 
that is closed under complements and countable unions.
</div>

<details>
<summary>Example</summary>
For $\Omega = \{1,2,3\}$, the collection $\{\varnothing, \{1,2,3\}, \{1\}, \{2,3\}\}$ is a $\sigma$-algebra.
</details>

---

# Measure

<div class="theorem" data-title="Theorem 1.1: Measure Extension">
Every pre-measure on an algebra of sets extends to a measure on the $\sigma$-algebra it generates.
</div>

<details>
<summary>Proof</summary>
This follows from Carathéodory’s extension theorem.
</details>

---

# Integration

<div class="lemma" data-title="Lemma 2.1: Monotone Convergence">
If $f_n \uparrow f$ pointwise, then $\int f_n \to \int f$.
</div>

<div class="proposition" data-title="Proposition 2.2: Convergence in Probability vs. a.s.">
Almost sure convergence implies convergence in probability, 
but not conversely.
</div>
