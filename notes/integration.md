## Lebesgue Integration

<div class="callout definition"><span class="label">Definition</span><br/>
Start with integrals of simple functions, extend by monotone limits.
</div>

<details class="collapsible">
  <summary>Monotone Convergence Theorem (proof template)</summary>
  <div class="collapsible__content">
    **Theorem.** If $0\le f_n \uparrow f$ then $\int f_n \to \int f$.
    <details class="collapsible">
      <summary>Key reduction</summary>
      <div class="collapsible__content">
        Reduce to simple functions and use monotonicity.
      </div>
    </details>
  </div>
</details>

### Example equations
$$ \int \mathbf{1}_A \, d\mu = \mu(A) \tag{(1)} $$
$$ \int \sum_i a_i \mathbf{1}_{A_i}\, d\mu = \sum_i a_i \mu(A_i) \tag{(2)} $$
