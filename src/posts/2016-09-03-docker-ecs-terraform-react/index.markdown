---
published: true
title: "Deploying react apps on docker using ecs and terraform part 1"
layout: post
date: 2016-09-03 10:52
tag:
- react
- docker
- ecs
- terraform
- deploy
- continuous
- integration
- deployment
blog: true
---

I was tinkering on blogging about Step 5 to React: Introduction to Redux, but I decided to write something closer to my heart: 
using ecs and terraform to deploy docker react apps (can I squeeze in anymore buzzwords?). This is not an intro to docker so 
I assume you are familiar with the basics. 
 
My plan was to use docker to achieve continuous integration and ultimately continuous delivery and then deployment. But I like to
start things small so the plan was to firstly create a docker image on every master merge and save that image. 

This image
is a stable and deployable package which can be deployed and run on any environment. This is the "golden" build concept - a single build
that is used on all steps of the deployment pipeline: uat, stage and prod. This is a good practice to adopt because the exact same 
build that has gone through all the QA steps is the one that's going out to production. 

It gives you confidence the prod deployment at the end
will work as expected. This is only possible if the package that comes out of your CI build is immutable - that's where docker comes in. I don't 
know about you but I get really turned on by this kind of stuff! Let's get to it!
 
## The end game
By the end of this blog, we want to be able to create a docker image containing our react app, be able to run lint, tests and the actual app
on that image.

We will be using the codebase from my [previous blog on react router](http://www.reactjunkie.com/step-four-to-react-routing-with-react-router/){:target="_blank"}. It's 
a minimal react spa with routing, you should be able to easily substitute your own codebase and follow the steps here to use docker.

## Step 1: Install docker
I'm on a mac so download docker for mac from [here](https://download.docker.com/mac/stable/Docker.dmg). It's a 110mb download so stop reading and do it first, continue reading later.
There are some hardware & os requirements. The important ones are:
<ul>
<li>OS X 10.10.3 Yosemite or newer</li>
<li>VirtualBox 4.3.30 or newer</li>
</ul>

If you have a previous install of docker-machine, mac docker will ask if you want to migrate data from that install to your new install. I said no because I don't have anything
important to migrate as I'll be starting from scratch.

Once installation is done, open terminal and type:
{% highlight bash %}
docker -v
{% endhighlight %}

You should get something like 
{% highlight bash %}
Docker version 1.12.0, build 8eab29e
{% endhighlight %}

Now we are ready to rock!

## Step 2: Create Dockerfile

We need to create a Dockerfile first. This is the sequence of instructions you tell docker to execute to create the image. 
It's akin to you manually entering a sequence of shell commands on the terminal of a new linux box when deploying your app. Except
docker runs it for you automatically, and then saves the resultant state of that linux box as an image.

So right click on the root directory of your project, add a new file call it <i>Dockerfile</i>. It should look like this:

####DockerFile
{% highlight bash %}
# We need a base image to build upon. Use the latest node image from 
# dockerhub as the base image so we get node and npm for free
FROM node:latest
MAINTAINER Yus Ng

# Store all our app code in the /src folder, starting from package.json
# first. Why copy package.json first? So we can take advantage of 
# the docker build cache. More below.
COPY package.json /src/package.json

# Once we have package.json, do npm install (restricting the loglevel
# to minimise noise)
RUN cd /src && npm install --loglevel error

# Copy all our code (yes including package.json again) to /src. 
COPY . /src

# Change directory into the /src folder so we can execute npm commands
WORKDIR /src

# This is the express port on which our app runs
EXPOSE 3000

# This is the default command to execute when docker run is issued. Only
# one CMD instruction is allowed per Dockerfile.
CMD npm start
{% endhighlight %}

<b>Important points</b>: 
<ul>
<li>Each instruction creates a new intermediate layer.</li>
<li>Docker uses the instruction string as the cache key. The result of that instruction is a new layer which gets stored as the cache value.</li>
<li>ADD and COPY instructions are special. The cache key for these are the checksum of their file contents.</li>
<li>If your package.json file does not change, the cache will be hit because the checksum matches. The next instruction npm install will also hit the cache 
because docker uses the instruction string as key which has not changed.</li>
<li>In contrast, consider what will happen if do COPY . /src and then followed by RUN npm install.</li>
<li>The COPY command does a checksum of all the files in current directory and compares that against previous layers. Some files
would have changed in the src folder, because it contains all our source code, images, config files, styles, etc. The checksum comparison would not match, hence
the cache will be invalidated. Once invalidated, all subsequent instructions will create new layers ignoring the cache.</li>
</ul>

For more information on docker build cache check the official doco [here](https://docs.docker.com/engine/userguide/eng-image/dockerfile_best-practices/){:target="_blank"}.

## Step 3: Create .dockerignore

We need one more file before we can build our image. Go ahead and add a new file to the root directory of your project call it 
<i>.dockerignore</i>

Docker will exclude files and directories specified here from the image. It should look like this:

{% highlight bash %}
.git
.gitignore
node_modules
npm-debug.log
{% endhighlight %}

## Step 4: Build the docker image

Let's do it! Go to terminal, cd into your root project folder where your Dockerfile resides and type the following (<b>NOTE</b> the "." at the end
is very important!): 

{% highlight bash %}
docker build -t reactjunkie:v1 .
{% endhighlight %}

Docker will build an image named "reactjunkie:v1" using the Dockerfile specified in the current directory (represented by the "." at the end). You can see it
by issuing the command:

{% highlight bash %}
docker images
{% endhighlight %}

You should see two images; the latest node base image which gets downloaded when docker built our image and our reactjunkie:v1 image.

## Step 5: Run the docker container

Now we have an image, we can start a container based on that image and run our app!

{% highlight bash %}
docker run -d -p 8080:3000 reactjunkie:v1
{% endhighlight %}

This command tells docker to run the default CMD command specified in the last line of our Dockerfile above. As we will see shortly we can
override this default by issuing our own commands.

<p>The -d flag tells docker to detach from the container process after issuing the command so we regain control of our terminal window.</p>
The -p flag maps the port on your mac (the host) to the container port.
Hit [http://localhost:8080](http://localhost:8080){:target="_blank"} and you should be able to see the app running!

## Step 6: Running lint and test

So the previous step demonstrated how we can run our webapp on our docker container. However in a CI environment, we want to be able to first build our image,
run lint and tests and then save the image first prior to starting the web app. 

I've setup eslint and jest in this project (available on [github](https://github.com/yusinto/docker){:target="_blank"}). To run eslint and tests on our container, type 
the following:

{% highlight bash %}
docker run -i --rm reactjunkie:v1 npm run lint
docker run -i --rm reactjunkie:v1 npm t
{% endhighlight %}

<p>The -i flag tells docker to run in "interactive" mode so we can see eslint console output from the container.</p>
<p>The --rm flag tells docker to automatically clean up the container and remove its file system when the it exits.</p>
<p>Then npm run lint and npm t are the commands that override the default CMD instruction in our Dockerfile. Docker will start
a container based on our image, issue these commands and then cleanup and remove the container when that command is finished.</p>

## What's next?
Now we have the docker image on our local machine, we need a way to export it to a central place so it can be shared with other developers, 
build systems and so on. Docker has dockerhub which does exactly that, but I use ECR which is aws' offering.

All the code in this blog are available on [github](https://github.com/yusinto/docker){:target="_blank"}

To be continued...


---------------------------------------------------------------------------------------
