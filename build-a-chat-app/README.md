# Real-Time Chat App

A shared chat room built with a Node.js WebSocket server (`ws`) and a plain HTML, CSS, and JavaScript client.

**Live demo:** https://kerens-chat-app.onrender.com

> Open it in two browser tabs, join with different usernames, and send a message. The demo runs on a free instance, so the first load after a quiet period can take up to a minute.

## Features

- Join with a username and chat instantly in one shared room
- Server broadcasts each message to every connected client (after checking the connection is open)
- Join and leave announcements
- Connect/disconnect button with a live connection status indicator
- User text is escaped in the browser to prevent HTML injection

## Tech

Node.js, WebSockets (`ws`), HTML, CSS, JavaScript

## Run locally

```bash
npm install
npm start
```

Then open http://localhost:3001.