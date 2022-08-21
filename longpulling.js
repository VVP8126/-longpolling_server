const express = require('express');
const cors = require('cors');
const events = require('events'); // Standard node module. Using for events management
const PORT = 5000;

// Long Pulling - the simplest way to organize interaction 'client - server'
// Doesn't require special protocols and ensures low workload for server
// Doesn't set up stable connection

//                              Scheme of work (in short)
// Client sends get-request and waits for some event (for chat - message sending)
// After event occured server returns some kind of answer
// Client after receiving sends another get-request and waits for a new event

// To create this project create react app 'client'. Add at the same level folder 'server'
// In folder 'server' run a command:
//      npm init -y
// Result - file 'package.json' will appear in 'server'
// Set up libraries: express, cors (for sending of request), nodemon (for hot reloading)
// In section 'scripts' of 'package.json' replace all for one string:
//      'start': "nodemon longpulling.js"


const emitter = new events.EventEmitter(); // Can create, call events, subscribe at events

const app = express();
app.use(cors());
app.use(express.json());

app.get("/get-messages", (request, responce) => {
    emitter.once( // sends message after catching of event emitted with method 'POST'
        "newMessage",
        (message) => {
            responce.json(message); // returns answer to all users of chat
        }
    );
});

app.post("/new-messages", (request, responce) => {
    const message = request.body;
    emitter.emit("newMessage", message); // sends event (with name="newMessage") with message 
    responce.status(200);
});

app.listen(
    PORT,
    () => {
        console.log(`Server started on port: ${PORT}`)
    }
);
