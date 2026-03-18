---
title: "Peskas: scalable, resilient, secure"
date: 2020-10-05T18:09:41+13:00
author: "Fernando Cagua"
draft: false
description: "In Peskas we are moving from a monolith towards a domain-based data-architecture. We want to enable the sustainable growth of the platform*."
tags: [ "architecture", "tech" ] 
ShowToc: false 
TocOpen: false 
mermaid: true
cover: /img/peskas-domain.png
---

*In Peskas we are moving from a monolith towards a domain-based data-architecture. We want to enable the sustainable growth of the platform*.

Peskas is a monitoring and analytics system for small-scale fisheries.
Currently, Peskas is used in Timor-Leste, where it provides previously-invisible data and insights to the Ministry of Agriculture and Fisheries. 
The downstream consequences are multiple: better reporting, better management, and better community empowerment. 

But the promise of Peskas goes beyond Timor-Leste. 
The insights provided by Peskas could be transformational for millions of people around the world whose livelihoods depend, directly or indirectly, on small-scale fisheries. 

The question is, how to scale Peskas to ensure it lives up to its promise? 

The current architecture of Peskas is "monolithic". 
This means that processing, analysis, modelling, visualisations, etc. are handled by a single code-base for all data sources. 
This approach works well now because there are only a couple of data sources that are processed and merged.
However, the monolithic architecture poses some challenges when we think about expanding the scope of Peskas. 

{{<mermaid>}}
%%{init: {'theme': 'neutral', 'themeVariables': { 'fontFamily': 'Roboto Condensed', 'fontSize': '14px'}}}%%
flowchart LR
  PD([Tracking<br>data]) --> PS[PARSER:<br/>Ingestion<br/>Cleaning<br/>Validation]
  CD([Catch data<br>Timor]) --> PS
  PS --> DB[(SQL<br>Database)]
  DB --> SA[SHINYAPP:<br>Modelling</br>Analysis<br/>Visualisation]
{{</mermaid>}}
{{< rawhtml >}}<figcaption>Current Peskas architecture–a data monolith. 
A parser script processes data from all sources and merges it and deposits it into a SQL database. 
A Shinyapp reads all data from the SQL database, post-processes them and displays them to the user.</figcaption>{{< /rawhtml >}}

## The challenges

*Scalability*: 
Right now, a new data source or a new feature would require changes to every single component in the application. 
Also, as the number of features increases, the risks of breaking existing functionality increase too and finding and solving problems becomes harder.
Furthermore, at least one person must have a complete overview of the pipeline.

*Resilience*: There is a single point of failure. 
Suppose the parsing for a specific data source fails (for example, there is a new column in the data collection survey). 
In that case, there is a good chance that the whole application will fail. 

*Security*: Catch and location data are confidential. 
Respecting the privacy of fishers and the ownership of their data is essential. 
Using a data monolith, as we do now, works well when we have only one jurisdiction. 
However, as Peskas expands to multiple jurisdictions, it can become tough to ensure that data are only seen by those who should.

## A domain-oriented data mesh

We were inspired by [recent developments](https://martinfowler.com/articles/data-monolith-to-mesh.html) in application and data warehouse architecture over the last years.
We realised that a distributed model could help us overcome the challenges that arise in a larger Peskas.

In a distributed model, the data do not flow through a central pipeline like in the monolith model. 
Instead, data is handled within the "domain" that owns the data and makes part of a bigger "mesh" of domains. 
Each domain plays a bounded role and should function largely independently from other domains. 
What this means is that as long as you clearly define what the "product" of each domain is, it doesn't matter how each domain handles the data internally. 
This separation is very powerful because it means that each domain can use the technologies and pipelines that best suits its purpose. 

In Peskas, we decided to, initially, align the domains with the sources of the data. 
In the future, as we expand its functionality, we will also include domains aligned to how the data is consumed (e.g. fisher insights, management insights, multiple country statistics, ...).

{{<mermaid>}}
%%{init: {'theme': 'neutral', 'themeVariables': { 'fontFamily': 'Roboto Condensed', 'fontSize': '14px'}}}%%
flowchart LR
    subgraph catch [Catch Domain - Timor]
        CD([Catch data<br>Timor]) 
        MC["Data stores and<br>processing services"] 
        CD --> MC
    end
    subgraph pelagic [Tracking Domain]
        PD([Tracking<br>data])
        MP["Data stores and<br>processing services"] 
        PD --> MP
    end
    PD --> pelagic
    pelagic --> FE
    subgraph merge [Spatial catch Domain]
        Ms["Data stores and<br>processing services"] 
    end
    catch --> merge
    pelagic --> merge
    merge --> FE
    catch --> FE[Web<br>intreface]

{{</mermaid>}}
{{< rawhtml >}}<figcaption>Proposed Peskas architecture–domain-based. 
Each domain is responsible for its pipeline and a product that can be consumed by other domains or users (e.g. a data analyst). 
The technological details inside a domain are abstracted and simplified.</figcaption>{{< /rawhtml >}}

This is how we see a domain based architecture can help us: 

*Scalability*: Adding a new data source does not require changes to existing components. 
A domain-based architecture is a self-serve infrastructure by default because each domain does not need to know who is using its product; it only needs to ensure the quality of the product. 
Domains can be developed independently by different team-members (or teams). 
It's easier to use the most appropriate coding language and infrastructure for each domain.

*Resilience*: If one of the domains fail, only one component of the application will fail. 
Also, it's easier to implement fallbacks because individual products are clearly defined. 

*Security*: Domains are related to data ownership, and each domain has independent data products. 
This separation makes it much easier to manage data access. 
Catch data from Timor-Leste, for example, is, by default, isolated from data from another country. 

There are also some disadvantages to a distributed model. 
The most obvious one is that there is potential for duplication of effort. 
This will happen, for example, if we need to solve a problem that has already been solved in another domain. 
We are hoping to solve this problem by implementing shared libraries and a common platform across domains that can be reused across similar domains while maintaining the independence of each domain. 

Get in touch if you would like to talk to us about the Peskas architecture. Feel free to have a look at [the code underlying Peskas implementation](https://github.com/peskas-platform). 
