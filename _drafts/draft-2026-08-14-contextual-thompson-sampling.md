---
layout: single
title: "Thompson Sampling: Picking a Workout Without a Coach"
description: A from-scratch walkthrough of contextual Thompson Sampling — the core idea, the disjoint linear-Gaussian model, the Sherman-Morrison update, the Cholesky sampling trick, and what the exploration knob actually does.
toc: true
toc_sticky: true
date: 2026-08-14
collection: posts
mathjax: true
tags:
  - thompson sampling
  - contextual bandits
  - bayesian statistics
  - machine learning
  - exploration vs exploitation
---

_Contextual bandits, explained through the world's laziest personal trainer._

## Background

Say you're building an app that, every morning, has to suggest a workout intensity: **easy**, **moderate**, or **hard**. You ask how tired you feel on a 0-to-1 scale, and the app picks one. If you actually complete the workout, that's a win; if you skip it or give up halfway, that's not.

There's no ground truth here - you never get to see what would've happened if the app had suggested something else that morning. You only observe the outcome of the intensity it actually picked. That's a **bandit problem**: choose an action, observe a reward for that action only, repeat.

Two things make the naive approaches unsatisfying:

- **It has to be contextual.** The right intensity on a day you're exhausted is not the right intensity on a day you're fresh. A single global policy - "always suggest moderate" - ignores the one piece of information you already told it.
- **It has to keep exploring.** A purely greedy policy (always pick whatever has looked best so far) can lock onto "easy" after a few lucky completions and never give "moderate" a fair shot again, especially if "moderate" only has a handful of data points to its name.

**Thompson Sampling** is one concrete algorithm that is simultaneously contextual and self-exploring. This post walks through the idea, the specific model behind it, an implementation from scratch, and what its one real knob actually does.

## The core idea of Thompson Sampling

Maintain a posterior belief distribution over each action's (unknown) true reward. To pick an action:

1. Draw **one sample** from each action's current posterior.
2. Act **greedily** on those samples - pick the action whose sample is highest.

That's it - no explicit exploration bonus, no random exploration rate. The exploration is a side effect of step 1: an action we're still uncertain about has a *wide* posterior, so its one sample occasionally lands high enough to win, even if its posterior *mean* is currently behind. As evidence accumulates, that action's posterior narrows, and its samples stop occasionally winning unless it's actually competitive.

This is why the technique is sometimes called **probability matching**: over many repeated calls at the same context, the empirical rate at which action $i$ wins converges to $P(\text{action } i \text{ is optimal} \mid \text{evidence so far})$ - without ever computing that probability as part of the decision rule. (We'll actually compute it in closed form later, purely as an analysis tool.)

Contrast this with two other common exploration strategies:

- **LinUCB** - deterministic optimism: add an explicit confidence-bound bonus to each action's estimate and pick the highest bonus-adjusted estimate. No randomness at all; the same context always yields the same action given the same state.
- **Epsilon-greedy** - undirected exploration: with probability $\varepsilon$, ignore estimates entirely and pick a uniformly random action. Exploration is constant and blind to how uncertain each action actually is.

Thompson Sampling sits in between: randomized like epsilon-greedy, but the randomness is shaped by uncertainty like LinUCB's bonus is.

## The model: disjoint linear-Gaussian TS

The simplest useful instantiation assumes a **linear-Gaussian reward model per action**: for action $a$, the reward given context $x$ is $\theta_a \cdot x$ plus noise, and the posterior over $\theta_a$ is Bayesian linear regression with a Gaussian prior - which stays Gaussian after every update (conjugacy). So the whole posterior for one action is captured by two objects: a mean-defining vector $b_a$ and a precision-inverse matrix $A_a^{-1}$, with

$$\text{mean}_a = A_a^{-1} b_a, \qquad \text{cov}_a = \text{scale}^2 \cdot A_a^{-1}.$$

"Disjoint" means each action's $\theta_a$ is estimated completely independently of every other action's. An observation about "easy" tells you nothing about "moderate" or "hard" - even though, intuitively, they're ordered points on the same intensity scale, not unrelated categories. That's a real limitation, and the fix (sharing information across actions via a joint model) is a reasonable follow-up, but it's out of scope here.

For our toy example, the context is one number - `tiredness` in $[0, 1]$ - plus a bias term, so $\theta_a$ is 2-dimensional: a weight on tiredness, and a baseline.

## Implementation walkthrough

Here's the whole thing, in about 30 lines, no dependencies beyond NumPy:

```python
import numpy as np

def sherman_morrison_update(a_inv: np.ndarray, x: np.ndarray) -> None:
    """In-place rank-one update: A_inv <- (A + x x^T)^{-1}, given A_inv."""
    a_inv_x = a_inv @ x
    denom = 1.0 + x @ a_inv_x
    a_inv -= np.outer(a_inv_x, a_inv_x) / denom

class ContextualTS:
    def __init__(self, actions, dim, sampling_scale=1.0, seed=0):
        self.actions = actions
        self.sampling_scale = sampling_scale
        self.a_inv = {a: np.eye(dim) for a in actions}
        self.b = {a: np.zeros(dim) for a in actions}
        self.rng = np.random.default_rng(seed)

    def update(self, action, x, reward):
        sherman_morrison_update(self.a_inv[action], x)
        self.b[action] += reward * x

    def sample_theta(self, action):
        mean = self.a_inv[action] @ self.b[action]
        cov = self.sampling_scale**2 * self.a_inv[action]
        lower = np.linalg.cholesky(cov)
        noise = self.rng.standard_normal(mean.shape)
        return mean + lower @ noise

    def select_action(self, x):
        scores = {a: float(self.sample_theta(a) @ x) for a in self.actions}
        return max(scores, key=scores.get)
```

Two things are worth slowing down on: how `update` avoids recomputing a matrix inverse from scratch, and how `sample_theta` turns a covariance matrix into an actual random draw.

### `update()` - the Sherman-Morrison rank-one update

Each new observation nudges one action's $(A^{-1}, b)$. The closed-form rank-one inverse update is

$$A^{-1}_{\text{new}} = A^{-1} - \frac{A^{-1} x x^\top A^{-1}}{1 + x^\top A^{-1} x}$$

applied in place, in $O(d^2)$ - instead of recomputing $A^{-1}$ from scratch (an $O(d^3)$ matrix inversion) after every single observation. That matters because in an online setting, observations arrive one at a time, and the whole point of an incremental update rule is that its cost doesn't blow up per row.

A quick sanity check that the incremental version agrees with brute-force recomputation:

```python
a_inv_before = model.a_inv["moderate"].copy()
x_new = np.array([0.42, 1.0])

a_inv_after_incremental = a_inv_before.copy()
sherman_morrison_update(a_inv_after_incremental, x_new)

a_before = np.linalg.inv(a_inv_before)
a_after_bruteforce = a_before + np.outer(x_new, x_new)
a_inv_after_bruteforce = np.linalg.inv(a_after_bruteforce)

np.allclose(a_inv_after_incremental, a_inv_after_bruteforce)  # True
```

### `sample_theta()` - the Cholesky trick

$A^{-1}$ is symmetric positive-definite, so its Cholesky factor $L$ satisfies $A^{-1} = LL^\top$. Multiplying isotropic white noise $z \sim \mathcal{N}(0, I)$ by $L$ reshapes a circle into a cloud whose covariance is exactly $\text{Cov}(Lz) = LL^\top = A^{-1}$ - stretched and rotated onto the posterior's principal axes, without ever computing eigenvectors explicitly.

After seeding the three actions with deliberately different fabricated histories - `easy` gets 40 observations of consistently high reward, `moderate` gets only 4 observations with mixed reward, `hard` gets 40 observations of consistently low reward - their posteriors already look distinct:

![Per-action posterior ellipses]({{ '/assets/cmab-ts/01_posterior_ellipses.png' | relative_url }})

`easy` and `hard` are tight (well-explored); `moderate` is wide (barely explored) despite sitting between them on the mean. Watching the white-noise-to-ellipse transform for `moderate` (the widest one) makes the mechanism concrete:

![White noise to posterior draw]({{ '/assets/cmab-ts/02_cholesky_transform.png' | relative_url }})

### `select_action()` - sample, score, argmax

```python
for action in self.actions:
    theta_sample = self.sample_theta(action)
    score = float(theta_sample @ x)
    # keep the action with the highest score
```

One sample per action, dot with the context vector, take the max - nothing else. At `tiredness = 0.6`, one such draw looks like this:

![One select_action draw]({{ '/assets/cmab-ts/03_one_draw.png' | relative_url }})

`easy` wins this particular draw. Run it again and it might not - that's the whole point.

## Reasoning about exploration analytically

The technique generalizes beyond this toy example: any time you need to reason about a deployed bandit's exploration behavior - debugging why an under-explored action rarely wins, or estimating a traffic split without running a live simulation - you can compute it directly from the model's $(A^{-1}, b)$ state, no simulation required.

At a fixed context $x$, each action's score $S_i = \theta_i \cdot x$ is itself Gaussian (since $x$ is fixed and $\theta_i$ is Gaussian):

$$S_i \sim \mathcal{N}(m_i, v_i), \qquad m_i = (A_i^{-1} b_i) \cdot x, \qquad v_i = \text{scale}^2 \cdot x^\top A_i^{-1} x$$

Since every action's $\theta$ is sampled independently, the "win rate" of action $i$ is precisely $P(S_i > S_j\ \forall j \neq i)$ - the probability that $i$'s independent Gaussian is the largest of $K$ Gaussians. With exactly two actions this has a closed form: $S_A - S_B \sim \mathcal{N}(m_A - m_B,\ v_A + v_B)$, so $P_A = \Phi\left(\frac{m_A - m_B}{\sqrt{v_A + v_B}}\right)$. With three or more, there's no closed form in general (it becomes an orthant probability of a multivariate normal), but a simple 1-D grid integration handles it fine when $K$ is small:

```python
def exact_win_probabilities(means, variances, n_grid=20_000):
    actions = list(means)
    stds = {a: np.sqrt(variances[a]) for a in actions}
    lo = min(means[a] - 6 * stds[a] for a in actions)
    hi = max(means[a] + 6 * stds[a] for a in actions)
    grid = np.linspace(lo, hi, n_grid)
    win_probs = {}
    for a in actions:
        density_a = stats.norm.pdf(grid, means[a], stds[a])
        prob_all_others_below = np.ones_like(grid)
        for other in actions:
            if other != a:
                prob_all_others_below *= stats.norm.cdf(grid, means[other], stds[other])
        win_probs[a] = float(np.trapezoid(density_a * prob_all_others_below, grid))
    return win_probs
```

Comparing that exact number against simply repeating `select_action()` a thousand times and counting winners:

![Exact vs Monte Carlo win probability]({{ '/assets/cmab-ts/04_exact_vs_monte_carlo.png' | relative_url }})

They agree, as they should - Monte Carlo is just estimating the same quantity the integral computes exactly. Worth noting: this exact computation is an *analysis* tool, not a faster way to run the decision itself. A single real decision only needs one cheap Gaussian draw per action and an argmax; the integral scans a whole grid. It earns its keep for offline monitoring - tracking the traffic split a posterior state would produce - not at decision time.

(For larger action counts, specialized routines like `scipy.stats.multivariate_normal.cdf` or Gauss-Hermite quadrature can out-perform a naive grid - but in my experiments the biggest single win was simply not over-provisioning the grid size in the first place, before reaching for a fancier method.)

### What does the exploration knob actually do?

The one hyperparameter that matters here is `sampling_scale`, which multiplies each action's posterior standard deviation before sampling. Since the win-probability integral above only depends on the variances through that scale, sweeping it is just re-scaling a term and re-running the same function - no re-simulation needed:

![Effect of sampling_scale on win rate]({{ '/assets/cmab-ts/05_sampling_scale_sweep.png' | relative_url }})

At very small `sampling_scale`, every posterior effectively collapses to its mean - `select_action` degenerates into greedy, and `easy` (the best posterior mean) wins essentially all the time regardless of how little `moderate` has been explored. As `sampling_scale` grows, posteriors widen enough that mean differences stop dominating, and win rate shifts toward the actions with more residual uncertainty - `moderate` and eventually even `hard` start winning a real share of draws. This is the explore/exploit dial, made visible as a curve instead of a single number.

## Takeaway

Thompson Sampling is the simplest exploration-aware policy that fits a genuinely common shape: a contextual decision, updated incrementally one observation at a time. The disjoint linear-Gaussian version above is intentionally simple - conjugate updates, closed-form sampling, no simulation needed to reason about its own behavior - and has one well-understood weakness (actions don't share information with each other), which is worth keeping in mind before reaching for it on a problem where that sharing matters.

| Parameter | Effect of increasing | Effect of decreasing |
|---|---|---|
| `sampling_scale` | More exploration; slower convergence to the best-known action | More exploitative; faster convergence, but more risk of committing early to a noisy estimate |
| context dimension $d$ | Richer context, but posterior sampling cost grows (cubic in $d$ from the Cholesky step) | Cheaper sampling, but coarser context discrimination |

## References

- Chapelle, O. & Li, L. (2011). [An Empirical Evaluation of Thompson Sampling.](https://papers.nips.cc/paper/2011/hash/e53a0a2978c28872a4505bdb51db06dc-Abstract.html) NeurIPS.
- Russo, D. et al. (2018). [A Tutorial on Thompson Sampling.](https://arxiv.org/abs/1707.02038) Foundations and Trends in Machine Learning.
- Agrawal, S. & Goyal, N. (2013). [Thompson Sampling for Contextual Bandits with Linear Payoffs.](https://arxiv.org/abs/1209.3352) ICML.
