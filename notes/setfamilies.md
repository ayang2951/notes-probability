> _Overview: We introduce a few critical set families, including fields, σ-fields, and π & λ systems._

## σ-Fields

Here, we will introduce one of the most critical definitions in measure theory. This definition is the first bit of scaffolding upon which measure theory is built.

<div class="callout definition"><span class="label">Definition</span><br/>
Let $\Omega$ be a space. A class $\mathcal{F}$ on $\Omega$ is called a <strong><em>$\sigma$-field</strong></em> or a <strong><em>$\sigma$-algebra</strong></em> if the following properties hold:
<ol type="i">
  <li>$\Omega \in \mathcal F$.</li>
  <li>For all sets $A \in \mathcal F$, $A^c \in \mathcal F$.</li>
  <li>For sets $A_1, A_2 \ldots A_n \ldots \in \mathcal F, \bigcup_{i = 1}^\infty A_i \in \mathcal F$.</li>
</ol>
</div>

<div class="callout proposition"><span class="label">Proposition</span><br/>
Fields are closed under finite unions and intersections.
</div>

<details class="collapsible">
  <summary>Proof</summary>
  <div class="collapsible__content">
    Step reasoning.

    <details class="collapsible">
      <summary>Sub-step A</summary>
      <div class="collapsible__content">
        Inner detail — works now.
      </div>
    </details>

  </div>
</details>

<div class="callout proposition"><span class="label">Proposition</span><br/>
prop text.
</div>

<div class="callout remark"><span class="label">Remark</span><br/>
remark text.
</div>

## π and λ Systems

<div class="callout theorem"><span class="label">Theorem</span><br/>
(Dynkin’s π–λ) If $\mathcal{D}$ is a λ-system containing a π-system $\mathcal{P}$, then $\sigma(\mathcal{P}) \subseteq \mathcal{D}$.
</div>

### Equation numbering template

default:
$$ \liminf_{n\to\infty} A_n \subseteq \limsup_{n\to\infty} A_n. $$

alphabetic:
$$ \bigcap_{n=m}^\infty A_n \subseteq \bigcup_{n=m}^\infty A_n \tag{(a)} $$

roman:
$$ (\limsup A_n)^c = \liminf (A_n^c) \tag{(i)} $$
