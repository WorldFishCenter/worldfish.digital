---
title: "New Peskas paper out now in PLoS One"
date: 2021-01-06T18:09:41+13:00
author: "Alex Tilley"
draft: false
description: "A new paper out in PLoS One detailing the design and piloting of the PeskAAS fisheries monitoring system"
tags: ["publications", "timor"] 
ShowToc: false 
TocOpen: false 
mermaid: false
cover: /img/hauling_dugouts.jpg
---

A new paper is now out in PLoS One which details the design and piloting of Peskas in East Timor. [Read and download it at the journal's website](https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0234760).

## Unreported doesn't mean illegal.

Global coverage of ocean issues typically links IUU with overfishing without emphasizing that much of this not necessarily Illegal, but may merely be Unreported. This is true for many small-scale fisheries worldwide as they are often remote and informal and tough to track. However, recent global research suggests that where data are routinely collected and used for fisheries management, fisheries are sustainable or increasing [(Hilborn et al., 2020)](https://www.pnas.org/content/117/4/2218). Furthermore, small-scale fisheries stakeholders are generally excluded from decision making around their resources and livelihoods due to this same lack of quantifiable evidence.

The adage **"If you can't count it, it doesn't count"** is particularly fitting in East Timor, a half-island nation north of Australia. 
Timor has one of the highest rates of malnutrition globally. Yet, despite the importance of fish for micronutrients, there has traditionally been very little investment in the fisheries sector. Around 80% of coastal households rely on marine resources to some degree. 

## Why we created PeskAAS

WorldFish has been working with the Government of East Timor since 2010. Initially, there were very few fisheries data on which to base recommendations. We set out to build a system with the government but were keen to avoid common pitfalls with tech interventions. Often apps and platforms that gather and display data are developed in funded projects by private companies. But when those projects end and the funding stops, the system typically fails, or the data remain behind a paywall. You need to pay the company to make any changes or updates to the software. We wanted a **digital, lightweight, responsive, and transparent** system. Still, we were also aware that to be maintained and used past external funding support,  it should be **affordable and open-source**.

## PeskAAS is a data pipeline

An R script pulls data together from the catch form and vessel trackers, combines them, organizes and analyses those data, then summarises them on a public webpage. We established a network of enumerators to record catch from fishers when they land using a simple XForm. Through a partnership with [Pelagic Data Systems](https://www.pelagicdata.com), we installed a few hundred of their solar-powered vessel trackers on canoes and motorboats. They provide very high-resolution positions compared to traditional VMS. 
Pelagic tracking is not free, but an optional extra that integrates with PeskAAS to provide spatial data for effort and CPUE. 
Peskas displays the summary data and plots of CPUE on a **webpage dashboard** built using R Shiny. You can visit this page and take a look [here](https://worldfish.shinyapps.io/peskAAS), it is public. 

## Outcomes

The interface and analytics are still simple in PeskAAS East Timor because this is an ongoing building and capacity development process. In other locations and contexts, we are working on automating biomass surplus production models to use and test in the adaptive management of community fisheries. We introduced PeskAAS in 2017, and the Timorese government adopted it quickly. It has brought new insights into fishing patterns, enabled more engagement with fishers and guided new fisheries policy. However, there is still much work to improve its contribution to inclusive governance.

The process of co-design with end-users and continuous feedback and consultations with local partners is crucial to the sustainability of information and communication technologies for small-scale fisheries [(FAO & WorldFish 2020)](http://www.fao.org/documents/card/en/c/cb2030en). We believe the rapid uptake and early policy successes are thanks to the strong local partnerships and trust with our local partners. 

*Photo credit: (c)WorldFish/J.Dos Reis Lopes*
