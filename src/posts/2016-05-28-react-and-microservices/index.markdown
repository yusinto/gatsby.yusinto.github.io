---
path: "/react-and-microservices"
date: "2016-05-28"
title: "How React fits into the microservice team structure"
published: true
tags: ["react", "microservices", "conway's law", "team structure"]
---

I am going to digress a little today and talk about how react fits into the microservice architectural style. Of course microservices and 
react are two buzzwords we hear all the time these days. While it might look like I am just shamelessly meshing these two things 
together to get more visitors to my site, you can't be further than the truth (*cough). 

Seriously though, I first learnt of microservices from [Udi Dahan](http://udidahan.com). For those of you who don't know him, he is the 
creator of NServiceBus and founder of Particular Software. I have nothing but great respect and admiration for him. So you can 
understand my jubilation and joy when I had the chance to meet him in person today at [DDD Sydney](http://dddsydney.com.au). We talked
about many a thing, one of them microservices and team structure. The two might seem unrelated but they actually are, more so than you think.

I was very starstruck. He seemed taller than in the videos. Maybe I was imagining things? Anyway I digress (again). So what is a service? 
I am going to shamelessly rip off Udi's quotes and say:

"A service is the technical authority for a specific business capability. It is autonomous. It has an explicit boundary. All data
and business rules reside within the service."

I used to think that a service is just a wcf or a webapi endpoint. For the longest time, I thought I was doing soa and microservices just
because I expose wcf and webapi endpoints in my application for consumption by other applications. This is incorrect. A service is an autonomous 
piece of your domain that is self contained. For example, you might have a product service and a customer service in your domain. The product
service has its own aggregates and its own database schema separate and independent of the customer service. The two services have explicit
boundaries and are autonomous. Each can use a completely different technology stack from the other. For example the product service might use
a relational database like sql server whereas the customer service might use a nosql database like mongodb. This is a very big topic which deserves
an entire blog post or technical course in its own right so I'm going to quit while I'm ahead and point you in the right direction more for information:
  
[Martin Fowler - Microservices@Sydney Yow!](https://www.youtube.com/watch?v=Irlw-LGIJO4)
[Udi Dahan - Advanced Distributed Systems Design](http://udidahan.com/training/) See below for free samples of his training videos.

Wait a minute, what's all this got to do with React? And what the heck has it got to do with team structure? Why am I still reading this crap when I could 
just easily watch a pirated copy of Game of Thrones?

When you write that react component that displays a product's image, description, seller info, etc, you become, or I should say you ARE a part of
the Product Service team. That team comprises of you plus the backend guys which implement the endpoint that talks to the product database. So you 
the react developer and the backend guys are all in the same Product Service team.

Conway's Law: Software follows the organisational structure of people who design it.

What does this mean? It means that if you are truly practising microservices, the react/angular guys and the backend .net/java guys are in the same team. 
In reality though, this is often not the case. Companies continue to organise their teams by physical tiers i.e. front end team, back end services team, 
mobile team, database team, etc irrespective of service orientation.


 
If you are inspired by this blog and want to know more about microservices or soa, I highly recommend you watch Udi's training videos. He
teaches a five day course on soa and for a limited time you can watch 2 full days of the course for free. Go [here](http://go.particular.net/DSY16)
and use the access code DSYU. This free offer expires 12 June 2016.

---------------------------------------------------------------------------------------
