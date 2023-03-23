<h1 align="center">
	🏓 ft_transcendance
 42cursus project 🌐
</h1>

<div align="center">
</div>

<h3 align="center">
	<a href="#about">About</a>
  <span> · </span>
	<a href="#usage">Usage</a>
	<span> · </span>
	<a href="#features">Features</a>
	<span> . </span>
  <a href="#contributors">Contributors</a>
</h3>



<h2 id="about">
About
</h2>

> This is 42 last common core project.
We had to do a website as a **single page application** in which you can play **Pong** but also **chat** with people in groupchat or private messages, invite them to play, look at their gamestats their current status.
The real challenge was building a pretty big project as a group, using language and frameworks we did know about.

Using ``Typescript`` and ``NestJS`` as backend framework was mandatory, and we chose to use ``React`` as frontend framework with ``TailwindCSS``.

<h2 id="usage">
🔨 Usage
</h2>

Build the project with :
``docker-compose up --build``

*You need to setup a .env file at root to make the project compile*

<h2 id="features">
📖 Features
</h2>

### Websockets
We used ``socket-io`` library.

It it useful for both the game and messages to get instant replies for the server but also to receive data from backend without request (as opposite to http requests)

### OAuth2
The authentication on the website had to be done using OAuth2 to log-in with your 42 Intra account.

It was the first time I used an external API, and it gives a better understanding of whats happening under the hood when logging on other applications.

### User input validation
​To check if user input is correct, NestJS provides Validation decorators.

Paired with DTOs (Data Transfer Object), it is really powerful.

It will reject any request not matching the decorators.

<h2 id="contributors">
 👥 Contributors
</h2>

* <a href="https://github.com/Rasaboun">SABOUNDJI Rayane(rasaboun)</a> Frontend
* <a href="https://github.com/meetchou">AMANFO Kwame(kamanfo)</a> Frontend
* <a href="https://github.com/bditte">DITTE Baptiste(bditte)</a> Backend
* <a href="https://github.com/adupav2000">DU-PAVILLON Alain(adu-pavi)</a> Docker 



