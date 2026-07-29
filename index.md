---
permalink: /
title: "Menachem (Meni) Sadigurschi"
layout: single
author_profile: true
---

Data scientist @ [Intent IQ](https://www.intentiq.com/).  
PhD in CS from the [Computer Science department](http://in.bgu.ac.il/en/natural_science/cs/Pages/default.aspx) of the Ben-Gurion University.  
Enthusiastic about anything which has to do with data.  
My Email: [meni.sadi@gmail.com](mailto:menisadi+site@gmail.com)  

<h2 class="archive__subtitle">Selected Publications</h2>

{% include publication-list.html selected_only=true show_authors=false %}

[All publications &rarr;](/publications/)

<h2 class="archive__subtitle">Recent Posts</h2>

{% for post in site.posts limit:3 %}
  {% include archive-single.html type="list" %}
{% endfor %}

[All posts &rarr;](/posts/)
