---
published: true
title: "Javascript Job Queues and Promises"
layout: post
date: 2017-09-18 07:30
tag:
- javascript
- promises
- job
- queues
- js
- asynchronous
- event
- loop
blog: true
---
So you think you know how promises work? Someone ever comes to you
with a little trivia called "what's the sequence of console logs from this
piece of async code"? And no matter how hard you try you never get
it right?

I experienced this at work last week and in process learnt something new about
promises which I would like to share.

There are few (if any) that explain the scheduling aspects of Promises though.
Perhaps because it's not a hot topic. It's too low level. You need a
shot of vodka to understand it. Bla bla.. so here goes nothing.

This is not an intro to promises or how to use them. There are plenty
of blogs out there explaining that in complete pornographic detail (give me
that vodka!). No sir, today I'll be talking about the temporal aspects
of promises i.e. "when" your code gets executed and why.

It's actually very interesting!

## Goal
Understand when parts of your promise gets executed and why.

## Step 1: Anatomy of a Promise
<script src="https://gist.github.com/yusinto/28295371fc7613f66fab39f0c7435c54.js"></script>

Wanna guess what the output is? You can run the code [here](https://repl.it/repls/WelloffSeveralPlatypus){:target="_blank"}
and see for yourself. Or I can just tell you. It is: 1 3 4 6 2 5.

It doesn’t matter if you guessed right or wrong. It matters if you understand why this is the output.

## Step 2: The executor
It is always run immediately! The moment you new up a Promise, the function
you specify in the constructor i.e. the executor gets run immediately in the current tick.

So 1 gets printed, then resolve gets called. Calling resolve marks the promise as
fulfilled and that’s it. It does not trigger anything else.

Then 3 gets printed. The current tick continues out of the promise constructor and prints 4.


## Step 3: .then
This is the interesting part. Remember the promise was resolved? When you
call .then on a resolved promise, the success handler gets scheduled in
the job queue. What the hell? What’s a job queue? Never heard of it. Am
I making this shit up? It’s [real](https://www.ecma-international.org/ecma-262/6.0/#sec-jobs-and-job-queues){:target="_blank"}
my friend. Keep reading.

## Step 4: The job queue
You must be familiar with the event loop and the event queue (if not, google them!)?
This gives javascript that infamous single-threaded reputation. Each iteration
of this loop is called a “tick”. Each tick processes a message from the event queue.
So is the event queue the same as the job queue?

No it is not. The job queue is a completely separate queue. More importantly,
messages in this queue are processed immediately at the end of each tick
before the beginning of the next tick. Each tick has its own job queue.

It’s like jumping the event queue. Success handlers for promises are
scheduled into this job queue. They get executed before the next message
in the event queue.

So with this newfound wisdom, our success handler above gets scheduled
in the job queue, to be run at the end of the tick.

## Step 5: What goes into the event queue?

Glad you asked. Things like setTimeout callbacks and event listeners are
scheduled into the event queue. So in our example above, console.log(5)
is scheduled into the event queue, even when the delay is 0ms. That means
this gets run after the success handler because the event queue is processed
in the next tick.

## Step 6: Booooringg

Ok ok last we saw our program, it output 4, so what’s next? We saw .then
and setTimeout are asynchronous i.e. they get scheduled into the job queue
and the event queue respectively, so the current tick continues and executes
console.log(6). The tick ends, or has it? We still have the job queue at
the of the tick, so no it has not ended yet.

Our program then executes the success handler, which is the first and only
job in the job queue. This outputs 2. Then the tick ends.

Finally our program continues to the next tick and executes console.log(5).
The end!

## Conclusion

Best have lotsa vodka when talking about promises. Thanks for reading!

---------------------------------------------------------------------------------------
