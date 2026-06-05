---
title: "API = All Possible Integrations: Introducing the Peskas API"
date: 2026-05-29T09:00:00Z
author: "Lorenzo Longobardi & Alexander Tilley"
draft: false
channel: peskas
description: "A new API gives national fisheries authorities, and the people they authorise, a consistent and well-documented way to reach validated fishing-trip data across Kenya, Mozambique and Zanzibar."
tags: [ "API", "Data Harmonisation", "Interoperability", "Data-Driven Management" ]
ShowToc: false
TocOpen: false
mermaid: true
cover: /img/peskas_api.png
---

*A new API gives national fisheries authorities, and the people they authorise, a consistent and well-documented way to reach validated fishing-trip data across Kenya, Mozambique and Zanzibar.*

Peskas has always been about making small-scale fisheries visible: recording what fishers land and turning it into numbers that managers can trust to use for making decisions. Across East Africa that means working with enumerators and partners in Kenya, Mozambique and Zanzibar to collect catch data and put it through the cleaning and validation steps that make it reliable.

But collecting and validating data is only useful if the data reaches the people who need it. Until now, each time a ministerial advisor, a fishery officer or a researcher wanted to validate or backup the data locally, someone on our side had to prepare a data export by hand. That is slow, hard to repeat, and harder still to keep consistent from one country to the next.

The Peskas API is our answer to that problem. It gives the owners of the data, and the people they choose to authorise, a single, consistent source of validated fishery data.

## A reliable way to reach the data

When we [redesigned Peskas around independent "domains"](/blog/domain-based-architecture), the idea was that each part of the system should produce a clear *product* that others can rely on, without needing to know how it was made. The API is that product. Behind it, the country pipelines still do the work of cleaning and validating the data. In front of it, reaching that data no longer means a one-off export.

Importantly, the API does not change who owns the data. Each country's data belongs to its national fisheries authority, and it is the government that decides who may access it. The API does not open the data to the world; it gives the data owners, and those they grant permission to, a dependable way to get to it.

{{<mermaid>}}
%%{init: {'theme': 'neutral', 'themeVariables': { 'fontFamily': 'Roboto Condensed', 'fontSize': '14px'}}}%%
flowchart LR
  A([Fisher catch<br>& trip data]) --> B[Cleaning &<br>validation]
  B --> C[(Validated<br>country data)]
  C --> API{{Peskas API}}
  API --> O([Fishery<br>officers])
  API --> G([Ministries])
  API --> P([Authorised<br>researchers & partners])
{{</mermaid>}}
{{< rawhtml >}}<figcaption>The pipelines still do the work of cleaning and validating each country's data. The API gives the data owners, and those they authorise, one consistent way to reach it.</figcaption>{{< /rawhtml >}}

## What the API provides today

At the moment, the API serves data at the level of individual fishing trips. For each recorded trip you can see where and when it landed, the gear and vessel used, how many fishers took part and how long they were at sea, and what they caught, broken down by species, weight and length. You can ask for a trip-level summary, or for the detail of each species group caught during a trip.

You also ask only for what you need. Rather than downloading everything and sorting it out afterwards, you can request a single country, a particular area, a date range, or a specific species, and get back just that.

## Clear variables, one shape across countries

Two things make this data easier to work with, particularly in a multi-country setting.

The first is that every field is clearly defined. The API data are documented: what each variable means, their units, and the values to expect. Anyone interpreting fisheries data knows how much time is usually lost working out exactly what a column represents, and how often the same word means different things in different places. A shared, documented vocabulary removes much of that friction.

The second is that the data arrives in a single, consistent shape. Kenya, Mozambique and Zanzibar each collect their data in their own way, from different raw sources. The API brings those sources together into one common structure and uses standard international codes for places and species, so the data lines up with other datasets instead of standing apart. It is an early but concrete step towards harmonised small-scale fisheries data across the region.

The data is also validated by default. Unless you deliberately ask for the raw version, the numbers you receive are the ones that have already passed our checks, and the API always returns the most recent version. And because it returns data in formats that drop straight into tools like R and Python, or into a web application, people can work with it where they already work to directly develop new analyses or tools.

## Closer to the people who manage fisheries

This matters most for the people closest to the fishery. For a local fishery officer, it is the difference between data that lives on paper, or on a colleague's laptop, and data they can simply request when they need it. There are no filing cabinets of survey sheets to re-enter nor chasing after whoever holds the latest spreadsheet: an officer can pull the validated trips for their own area directly, in a form that is ready to read or analyse.

The same is true for a ministry preparing a management plan, or a researcher comparing fisheries across several countries that, for the first time, share a common data structure.

## Looking ahead

Today the API works at the level of individual trips. A planned next step is an endpoint that serves data already aggregated, for example monthly catch totals, in a form ready for official reporting to the FAO and other intergovernmental agencies. Much of that reporting is still put together by hand; providing it straight from validated data would save effort and make the figures easier to trace back to their source.

As more data sources and countries come into Peskas, the same approach should let them join without changing how the data is reached or read.

## Get involved

The Peskas API is open-source, like the rest of the platform. Get in touch if you would like to talk to us about putting the Peskas API to use.
