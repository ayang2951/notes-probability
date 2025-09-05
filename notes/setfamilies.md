> _Scaffold: Fields, σ-fields, π/λ systems, Dynkin’s lemma._

## Fields and σ-Fields

<div class="callout definition"><span class="label">Definition</span><br/>
A <em>field</em> (algebra) $\mathcal{F}_0$ on $\Omega$ satisfies:
(i) $\Omega \in \mathcal{F}_0$,
(ii) if $A\in \mathcal{F}_0$ then $A^c\in \mathcal{F}_0$,
(iii) if $A,B\in\mathcal{F}_0$ then $A\cup B\in\mathcal{F}_0$.
</div>

<div class="callout proposition"><span class="label">Proposition</span><br/>
Fields are closed under finite unions and intersections.
</div>

<details class="collapsible">
  <summary>Proof (expand)</summary>
  <div class="collapsible__content">
    <p>We show closure under union and intersection.</p>

    <details class="collapsible">
      <summary>Step 1 — Union case</summary>
      <div class="collapsible__content">
        <p>If $A,B\in\mathcal{F}_0$ then $A\cup B\in\mathcal{F}_0$ by assumption.</p>
      </div>
    </details>

    <details class="collapsible">
      <summary>Step 2 — Intersection case (sub-collapsible)</summary>
      <div class="collapsible__content">
        <p>Use De Morgan: $A\cap B=(A^c\cup B^c)^c$, and the right-hand side is in $\mathcal{F}_0$.</p>
        <details class="collapsible">
          <summary>Sub-step: De Morgan identity</summary>
          <div class="collapsible__content">
            <p>The identity is straightforward and left as an exercise.</p>
          </div>
        </details>
      </div>
    </details>

  </div>
</details>

## π and λ Systems

<div class="callout theorem"><span class="label">Theorem</span><br/>
(Dynkin’s π–λ) If $\mathcal{D}$ is a λ-system containing a π-system $\mathcal{P}$, then $\sigma(\mathcal{P}) \subseteq \mathcal{D}$.
</div>

### Equation numbering examples

Default (AMS automatic):
$$ \liminf_{n\to\infty} A_n \subseteq \limsup_{n\to\infty} A_n. $$

Manual alphabetic tag:
$$ \bigcap_{n=m}^\infty A_n \subseteq \bigcup_{n=m}^\infty A_n \tag{(a)} $$

Manual roman tag:
$$ (\limsup A_n)^c = \liminf (A_n^c) \tag{(i)} $$
