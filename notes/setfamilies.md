> _This section’s scaffold mirrors your PDF’s “Families of Sets” (Fields and σ-Fields; π and λ Systems; Dynkin’s Lemma). Paste your material here._ :contentReference[oaicite:2]{index=2}

## Fields and σ-Fields

<div class="callout"><span class="label">Definition</span><br/>
A <em>field</em> (algebra) $\mathcal{F}_0$ on $\Omega$ satisfies:
(i) $\Omega \in \mathcal{F}_0$,
(ii) if $A\in \mathcal{F}_0$ then $A^c\in \mathcal{F}_0$,
(iii) if $A,B\in\mathcal{F}_0$ then $A\cup B\in\mathcal{F}_0$.
</div>

<div class="callout"><span class="label">Proposition</span> (Finite unions/intersections)
Fields are closed under finite unions and intersections.</div>

<details class="collapsible">
  <summary>Proof (click to expand)</summary>
  <div class="collapsible__content">
    <p>Use De Morgan and closure under complementation/finite unions.</p>
    <details class="collapsible">
      <summary>Sub-proof: intersection case</summary>
      <div class="collapsible__content">
        <p>$A\cap B = (A^c \cup B^c)^c$.</p>
      </div>
    </details>
  </div>
</details>

## $\pi$ and $\lambda$ Systems

- $\pi$-system: closed under finite intersections.
- $\lambda$-system (Dynkin system): contains $\Omega$, closed under complements and countable disjoint unions.

<details class="collapsible">
  <summary>Dynkin’s Lemma (sketch)</summary>
  <div class="collapsible__content">
    <p>If $\mathcal{D}$ is a $\lambda$-system containing a $\pi$-system $\mathcal{P}$, then $\sigma(\mathcal{P})\subseteq \mathcal{D}$.</p>
  </div>
</details>

### Example equations with different numbering systems

1. **Default (arabic via AMS tags):**  
   $$ \liminf_{n\to\infty} A_n \subseteq \limsup_{n\to\infty} A_n. \label{eq:lims} $$

2. **Manual alphabetic tags:**  
   $$ \bigcap_{n=m}^\infty A_n \subseteq \bigcup_{n=m}^\infty A_n \tag{(a)} $$

3. **Manual roman tags:**  
   $$ (\limsup A_n)^c = \liminf (A_n^c) \tag{(i)} $$

> Tip: Use `\tag{(a)}`, `\tag{(b)}`, `\tag{(i)}`, `\tag{(ii)}` to “switch” numbering styles per-equation. Lists can also show different numbering via CSS classes, e.g.:

<ol class="alpha">
  <li>alphabetic step</li>
  <li>another step</li>
</ol>

<ol class="roman">
  <li>roman step</li>
  <li>another step</li>
</ol>
