> _“Lebesgue Integration” scaffold: standard machine, properties, dominated/monotone convergence, etc._ :contentReference[oaicite:4]{index=4}

### Standard Machine
- Build integral on indicators, extend to simple, then nonnegative, then integrable.

<details class="collapsible">
  <summary>Proof template: Monotone Convergence</summary>
  <div class="collapsible__content">
    <p>If $0\le f_n\uparrow f$, then $\int f_n \to \int f$.</p>
  </div>
</details>

### Example with manual equation tags

$$ \int \mathbf{1}_A \, d\mu = \mu(A) \tag{(1)} $$
$$ \int \sum_i a_i \mathbf{1}_{A_i}\, d\mu = \sum_i a_i \mu(A_i) \tag{(2)} $$
$$ \int f \, d\mu = \int f^+ d\mu - \int f^- d\mu \tag{(iii)} $$
