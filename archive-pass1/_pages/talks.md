---
layout: page
title: speaking
permalink: /talks/
description: Conference talks, keynotes, podcasts, and webinars from 2010-present.
nav: true
nav_order: 2
---

I've been speaking at conferences, meetups, and podcasts for over 15 years, covering topics from social media APIs to enterprise modernization to AI transformation. My talks have taken me across three continents—from Austin to Stockholm to San Francisco.

## Featured Talks

<div class="row row-cols-1 row-cols-md-2 g-4 mb-4">
{% assign featured = site.talks | where: "featured", true | sort: "date" | reverse %}
{% for talk in featured %}
<div class="col">
  <div class="card h-100">
    <div class="card-body">
      <h5 class="card-title"><a href="{{ talk.url | relative_url }}">{{ talk.title }}</a></h5>
      <h6 class="card-subtitle mb-2 text-muted">{{ talk.event }} · {{ talk.date | date: "%Y" }}</h6>
      <p class="card-text small">{{ talk.location }}</p>
      <p class="card-text">{{ talk.description | truncate: 150 }}</p>
    </div>
    <div class="card-footer bg-transparent">
      <span class="badge bg-primary">{{ talk.type | replace: "_", " " | capitalize }}</span>
    </div>
  </div>
</div>
{% endfor %}
</div>

---

## All Appearances

{% assign talks_by_year = site.talks | sort: "date" | reverse | group_by_exp: "talk", "talk.date | date: '%Y'" %}
{% for year in talks_by_year %}
### {{ year.name }}

<ul class="list-group list-group-flush mb-4">
{% for talk in year.items %}
<li class="list-group-item d-flex justify-content-between align-items-start">
  <div class="ms-2 me-auto">
    <div class="fw-bold"><a href="{{ talk.url | relative_url }}">{{ talk.title }}</a></div>
    <small class="text-muted">{{ talk.event }} · {{ talk.location }}</small>
  </div>
  <span class="badge bg-light text-dark">{{ talk.type | replace: "_", " " }}</span>
</li>
{% endfor %}
</ul>
{% endfor %}
