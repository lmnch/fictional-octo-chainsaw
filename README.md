# Introduction
The idea behind `fictional-octo-chainsaw` is to convert a discord server to an esacape room.
To do so it creates different rooms which consists of related speech and text channels. 
Each room has a speech channel to communicate with other users in the same room and one or more text channels to display the question or the task.
The rooms and tasks are configured in a json file.

# Features
* Mysteries are defined as json and contain rooms with tasks
* Transform your server by creating channels and roles
* Manages roles (-> related visibilities) for each member

# Technologies
The project is written in ECMAScript using [node.js](https://nodejs.org/en/) and [discord.js](https://discord.js.org/)

# Run the project
1. Clone the project
2. Run `npm install`
3. Create a `discord_token` file in the workspace folder
4. Discord bot (described [here](https://discord.com/developers/docs/intro))
5. Copy the token in the `discord_token` file
6. Run `npm run test`
7. The bot is now running!
8. Add the bot to your discord server (it needs admin rights!)
9. Type `terra *name of the mystery*`
10. Now the bot creates required roles and channels on the server
11. Users can now enter `start` to get access to the first room

**You (the server owner) will still see all the channels! Not only the initial room.**

# Project structure
## `model`
Representation of rooms and tasks.

## `data`
Reads data from json files to models.

## `terraformer`
Creates channels on server.

## `riddler`
Writes task description, ... in the related channels and checks answers from players.

## `gatekeeper`
Gives and checks users access roles which represents moving from one room to another.
