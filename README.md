# ft_transcendence
This is 42 last common core project.

We had to do a website as a single page application in which you can play Pong but also chat with people in groupchat or private messages, invite them to play, look at their gamestats their current status.

The real challenge as building a pretty big group project using language and frameworks we did know about.

Using ``Typescript`` and ``NestJS`` as backend framework was mandatory, and we chose to use ``React`` as frontend framework.

## Usage

Build the project with :
``docker-compose up --build``

*You need to setup a .env file at root to make the project compile*

## Features

### Websockets
We used ``socket-io`` library.

It it useful for both the game and messages to get instant replies for the server but also to receive data from backend without request (as opposite to http requests)

### OAuth2
The authentication on the website had to be done using OAuth2 to log-in with your 42 Intra account.

It was the first time I used an external API, and it gives a better understanding of whats happening under the hood when logging on other applications.

### User input validation

