---
title: "RAD Is Back: AI Engineering Is the New Visual Basic"
date: 2026-03-13
description: "We had something good, we made it complicated, and now AI is giving it back to us. Tracing the arc from Visual Basic's RAD era through cloud and DevOps complexity to today's AI-assisted collapse of the stack."
tags: ["ai", "devops", "engineering", "history"]
featured: true
draft: false
category: "essay"
ai:
  assisted: true
  tools: ["Claude"]
  role: "pair-writing"
  process: "Collaborative essay developed through iterative conversation between human and AI, with the human providing the thesis and editorial direction."
paceLayers:
  - layer: infrastructure
    rationale: "The essay's central arc traces how infrastructure complexity — cloud, DevOps, Kubernetes, CI/CD — accreted over two decades, burying the productivity that simpler tooling once provided."
  - layer: commerce
    rationale: "RAD-era VB and AI-era tooling both derive their power from collapsing costs for small teams, enabling solo developers and pairs to ship commercially viable products without platform teams."
  - layer: fashion
    rationale: "AI-assisted engineering is the current fast-moving layer — the newest abstraction compressing everything beneath it, still in its trend phase before the slower layers absorb or reject it."
---

There's a pattern in software engineering that nobody talks about enough. We had something good, we made it complicated, and now AI is giving it back to us.

Here's the timeline:

**1993** — Microsoft ships Visual Basic 3.0. Suddenly, a solo developer or a pair can drag controls onto a form, wire up a database, and ship a working client-server app to production by Friday. It's not elegant. The purists hate it. But it *works*, and small teams are absurdly productive. This is the golden age of Rapid Application Development.

**2006** — Amazon launches S3 in March and EC2 in August. Infrastructure becomes an API call. This is a massive unlock — but it's also the beginning of a massive increase in the surface area of "stuff you need to know" to ship software. You're no longer just writing code; you're configuring load balancers, setting up VPCs, writing IAM policies, and managing deployment pipelines.

**~2009** — The DevOps movement coalesces. Patrick Debois organizes the first DevOpsDays in Ghent. The Velocity Conference gives us the legendary "10+ Deploys Per Day" talk from Flickr. The thesis is correct: dev and ops *should* collaborate. But the practical result is that "shipping to production" becomes a discipline unto itself. Kubernetes, Terraform, CI/CD pipelines, observability stacks, service meshes — the operational complexity mushrooms. The 1-2 person team that could ship a VB app to prod? Gone. Now you need a platform team just to support the teams that write the code.

**2026** — AI-assisted engineering tools like Claude Code collapse the stack again. A single developer can describe infrastructure in natural language, generate Terraform configs, debug deployment issues, write and run database migrations, set up monitoring — all in the same flow as writing application code. The AI handles the operational cognitive load that previously required dedicated specialists. The RAD-style feedback loop returns: think it, build it, ship it, *fast*.

---

The parallel isn't exact, of course. VB3 apps were simple client-server CRUD. Today's systems are distributed, cloud-native, and orders of magnitude more complex. But the *shape* of the productivity curve is the same: a powerful abstraction layer that lets small teams punch above their weight.

What VB did for UI development — making it accessible to non-specialists through visual tooling — AI engineering is doing for the entire stack. The grunge work of DevOps doesn't disappear; it gets absorbed by an AI that's read every Terraform doc, every AWS troubleshooting guide, and every Stack Overflow thread about CORS errors.

We spent a decade building the complexity. We spent another decade building the tooling to manage the complexity. Now AI is compressing it all back down to something that feels, once again, like one person with a good idea and a fast feedback loop.

RAD is back. It just doesn't look like a drag-and-drop form designer anymore.
