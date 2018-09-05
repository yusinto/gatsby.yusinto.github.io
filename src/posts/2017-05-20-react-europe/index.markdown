---
path: "/react-europe"
date: "2017-05-20"
title: "React Europe"
published: true
tags: ["react", "europe", "conference", "paris", "france"]
files:
 - "./max_nik.png"
 - "./dafeng.png"
 - "./griffith.png"
 - "./brian.png"
 - "./react_conference_collage.png"
---
As I stared at the partially cloudy Parisian sky from my seat at Gare du Nord, 
I had a chance to reflect on the week that was. 4 days jam packed with 
javascript and react from morning till night followed by socialising afterwards 
(my fave), it's definitely not for the faint-hearted. I admit I was a little 
overwhelmed by the intensity of the schedule.

## Workshops
I attended a 2-day advanced react workshop with [Nik Graf (serverless)](https://github.com/nikgraf)
and [Max Stoiber (styled components)](https://github.com/mxstbr). 
I learnt loads about the react children api which I never really used before from Max and about
the apollo graphql client for react from both Nik and Max. The exercises were very hands-on and realistic.
In one exercise we had to implement a graphql backend and apollo front end for a recipe application.
This involves setting up the graphql types, queries and mutations.

I am already using graphql and relay at work (qantasassure.com) so I thought this would be a piece of cake.
Not exactly. It turns out the tools for graphql in the backend and frontend have
evolved so much since I set it up 6 months ago, it was almost foreign to me. In a good way.
I learnt it's so much easier and simpler now to setup a graphql server with types and queries and mutations.
Apollo really has done a lot of work to simplify the integration of graphql into react.
 
It's so good to finally see the face behind the code! I am both a fan and user of serverless
and styled components, so thanks for teaching me so much guys!

<img alt="Max Stoiber and Nik Graf" src="/static/max_nik.png" id="markdownImage"/>

## The main event
Prior to the start of the conference we heard word that Dan Abramov will not make it to Paris.
He had some visa issues which didn't allow him to enter Paris. Fuck. I should really ask for
a refund.

Anyway the conference started with Andrew Clark (recompose) announcing the imminent release
of react fiber (eta end of year). He's one of the better speakers in the conference. I tend to
pay more attention to people who use the stage and are comfortable moving about on the stage.
The delivery style of the presentation is also important. Some speakers tend to just read off
the screen and narrate, just the recipe to put people to sleep. Think kids and bedtime 
story time. I expected more from all the speakers in this regard.
  
Andrew and a few others like Lee Byron, Kevin Lacker, Sunil Pai were excellent though. Part improvised 
part narratted, I really enjoy their presentations. Sunil in particular is my favourite speaker,
he's really funny. His name reminds of the movie Life of Pi (of course his name is Pai, not Pi).

My picks:

<b>Lee Byron</b> - released [Relay Modern v1.0](https://facebook.github.io/relay/docs/relay-modern.html) 
live on stage. Relay Modern now supports static queries, client side only fields and subscriptions. 
Client side only fields mean that you can use relay to replace redux. Relay classic will still be supported in npm under
react-relay/classic.

<b>Sunil Pai</b> - author of glamour, glam and rakt. Rakt is an ambitious project which aims to umm do everything. By everything I mean
taking care of code splitting, data fetching, inline styling (via glamour) and more. It is still not finished yet, so check
[Sunil's page](https://github.com/threepointone/rakt) often. Sunil is my favourite speaker at the conference, he's
engaging, impromptu and funny. All ingredients for a captivating talk.

<b>Andrew Clarke</b> - talks about React Fiber which will be released with React 16 at the end of the year. He also
briefly talked about react portals, which are components which don't quite fit in the dom tree like modals
and overlays.

<b>Sarah Drasner</b> - shows really cool css animations/transforms using [GreenSock](https://greensock.com/get-started-js). 
It's so cool and easy to use.
 
<b>Wix lightning talk</b> - introduces [detox](https://github.com/wix/detox) which is a functional 
testing framework for react native. It's super cool! It does grey box e2e testing of your react native apps automatically and it's super fast!
If you use react native you must check it out.
 
<b>Apollo lightning talk</b> - Apollo has released a [chrome devtool plugin](https://github.com/apollographql/apollo-client-devtools)
for graphql. It runs graphiql in chrome devtools! It also has a query inspector and a store inspector. Check it out!
 
<b>Expo lightning talk</b> - Expo has created a playground for react native at [snack.expo.io](http://snack.expo.io).
You can run your react native code on the web without the simulator! It's like jsfiddle for react native.
 
<b>Sasha Aickin</b> - talks about streaming react dom to the client in chunks to boost performance. This involves chunk rendering, which is a
technique involving breaking up a page into different chunks, each with its own html, js, css and data. Each chunk
gets flushed to the client side separately, increasing parallelism and hence performance. Check out his github package 
[react-dom-stream](https://github.com/aickin/react-dom-stream)
 
## Social Insights
Perhaps the best lessons I learnt from the conference are not from the speakers, but from the people I met. There
were many like me, all keen to share their views, opinions and experience and also to listen. Talking to these
developers gave me a chance to validate some of the assumptions I make in my projects and to see the tools and 
techniques others use in their apps.

These are some of the people I met and the insights I gathered from them:

<b>Dafeng Guo cofounder of strikingly</b> - started strikingly with 2 other founders in YCombinator in 2012. They had 0 paying customers
in 2012, now they have over 130 employees and a lot more customers :). I am a user of strikingly and I can't recommend it enough. He also
showed me strikingly's latest wechat feature where strikingly websites now are automatically converted to wechat apps. That's super cool!
<img alt="Dafeng" src="/static/dafeng.png" id="markdownImage"/>

<b>Griffith Tchen Pan</b> - works at myworkpapers.com. Started in Gold Coast Australia and now has offices in USA and London. 8 years of
 dedication and commitment to a product pays off. That's what I learned from him.
 <img alt="Griffith" src="/static/griffith.png" id="markdownImage"/>

<b>Brian Christensen</b> Danish guy I met at the workshop. Arguably the smartest guy in Denmark, he knows everything from docker to glam to
elm, and does not have a CI in place at his workplace. Just kidding Brian :). He drinks a lot.
<img alt="Brian" src="/static/brian.png" id="markdownImage"/>

# Conclusion
It's not the best organised conference I've been for a few reasons. 

Firstly as I mentioned above, some of the speakers weren't really very engaging. 
It was really tough to keep awake at times. Second the food was really really bad. 
During the workshops, there was no protein whatsoever for lunch. It was only 
salad, quinoa, rice, pasta. Where's the meat!!?! Or fish??!? Thirdly the cancellation of Dan Abramov was 
disappointing. Even Max Stoiber didn't stick around to give his presentation (no reason given). 
Maybe they were put off by the food...

I travelled 26 hours from Sydney Australia, stopping at 3 different countries en route to Paris, 
and then back. Is it worth it? Yes. I definitely won't forget it. Here are more pics from all
the great people I met. Till next time!

<img alt="Brian" src="/static/react_conference_collage.png" id="markdownImage"/>


---------------------------------------------------------------------------------------
