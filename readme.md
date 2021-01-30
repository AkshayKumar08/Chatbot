# Chatbot
### Using Dialogflow

# What is Chatbot?

For businesses, it has become necessary to solve the queries and problems of the customers to ensure consumer loyalty along with the brand establishment. And just like the earlier times, man has looked to take help of machines to remove the constraints of human limitations. This time it is the customer service industry which has been revolutionized, and the innovation responsible for this is chatbot. Chatbots are considered the future of customer service and management.

# What is Dialogflow?

Dialogflow is a natural language understanding platform that makes it easy to design and integrate a conversational user interface into your mobile app, web application, device, bot, interactive voice response system, and so on.

# What we are going to do?

In this project, we are going to build a chatbot which register a complaint and generate a trouble ticket.


# What do we need?

1. Server Environment: NodeJS (Download [here](https://nodejs.org/en/) ).
2. Framework: ExpressJS
3. Database: MongoDB ( Download [here](https://www.mongodb.com/try/download/community) ).
4. NLP platform: Dialogflow ( Open[here](https://dialogflow.cloud.google.com/))
5. Cross-platform application: ngrok ( Download [here](https://ngrok.com/download) ).
6. Postman (Download [here](https://www.postman.com/downloads) ).
7. and your favorite editor(My favorite: Sublime Text)

# Steps

1. Installing dependencies
2. Creating Database
3. Writing into User Collection
4. Connecting NodeJS to MongoDB
5. Writing expressJS
6. Writing intent.js
7. writing dialogflow intents
8. Connecting NodeJS with dialogflow
9. Integration

# Installing dependencies
We are going to install dependencies for our NodeJS

## Production dependencies
**Production dependencies** are normal dependencies that are mandatory for running the project.

We need:
- actions-on-google
- body-parser
- dialogflow-fulfillment
- express
- mongodb

To Install them:
```
npm i package_name
npm i actions-on-google body-parser dialogflow-fulfillment express mongodb
```

## Development Dependencies

Next are development dependencies, these are those dependencies which are needed at the time of development but are not responsible for working of the application i.e. even if we skip these dependency our application will work just fine. One such most common is nodemon which

> is a tool that helps develop node.js based applications by automatically restarting the node application when file changes in the directory are detected.

and ngrok which
> is a cross-platform application that enables developers to expose a local development server to the Internet with minimal effort.
```
npm i package_name
npm i nodemon --save-dev
```

Now your node dependencies are setup.


# Creating Database

We are going to use mongoDB as our database. Here we are going to create 2 collections.

- Users
- Issues

**Users Collection**

Contains 2 fields
1. mobile
2. username


**Issues Collection**

Contains 6 fields
1. mobile
2. title
3. discription
4. date
5. status
6. trouble_ticket

# Writing into User Collection
	
We are going to add some arbitrary data to our 'User' colection. You have 2 methods to add data:

- Directly using mongod.exe
- Using Postman and creating routes ( Open[here](https://github.com/AkshayKumar08/Chatbot/tree/master/src/routes)).

Here am using Postman to add users to Database.

# Connecting NodeJS to MongoDB

We are going to create a file mongoUtil.js which connects to MongoDB. We need mongodb package to connect to express code. MongoClient is just a Nodejs library that handles connecting to and interacting with a MongoDB database.Since we are using localhost we are specifying 127.0.0.1 and mongoDB uses default port number 27017. The name to our data base is 'Chatbot'.
(code [here](https://github.com/AkshayKumar08/Chatbot/blob/master/src/mongoUtil.js) )

```
const url = 'mongodb://127.0.0.1:27017'
const dbName = 'Chatbot'
const MongoClient = require('mongodb').MongoClient
```

Now we are going to connect using url and dbName. Since we are dealing with database we are going to use async and await. After that we are going to export it into our index.js
```
MongoClient.connect(url, {useUnifiedTopology: true}, async (err, client) => {
    try{
		db = await client.db(dbName);
        console.log(`Connected Database: ${url}`)
        console.log(`Database : ${dbName}`)
    }
    catch(err){
        console.log(err);
    }
})
```

- [x] MongoDB
- [ ] ExpressJS
- [ ] Dialogflow

# Writing expressJS

We are going to need express, WebhookClient, and also mongoUtil that we just wrote. (code [here](https://github.com/AkshayKumar08/Chatbot/blob/master/src/index.js) )
```
const express = require('express')
const { WebhookClient } = require("dialogflow-fulfillment");
const mongoUtil = require('./mongoUtil');
```

We need to listen to a port, so we are going to return process environment if it exist or assign a port number to it. Here we are using 8080 port number as our default port number.
`const PORT = process.env.PORT || 8080`

We are going to write a Post method for dialogflow with route `/dialogflow`. we are going to map our (req, res) to (request, response) of our WebhookClient and assign it to agent `const agent = new WebhookClient({ request: req, response: res });`
For each intent we need a function to be executed so we are going to use intentMap to map each intent to function. All request are handled by `agent.handleRequest()` function.

# Writing intent.js

Here we have all the functions that are executed which a particular intent is requested. The project following flow:(code [here](https://github.com/AkshayKumar08/Chatbot/blob/master/src/intents/intent.js) )

1. Welcome intent which accepts mobile number from customer.
2. Searching database for username with that particular mobile number and greeting the number if exist in DB.
3. A registering complaint
   - storing mobile number from previous intent.
   - taking Title of issue.
   - taking description of issue.
   - storing Issue in database and generating trouble ticket.


**getting mobile number from DB**

Since mobile number is unique we are going to use `findOne()` function in MongoDB and return username if it exist or else we are going to respond by rejecting the number.

**Updating Issue in DataBase**

Here we are going to take information from context and we are going to store it in database. All our context information is stored in awaiting_mobile context.

```
const confirm = agent.context.contexts.awaiting_mobile;
const mobile = confirm.parameters['mobile.original'];
const title = confirm.parameters['title.original'];
const description = confirm.parameters['desc.original'];
```
we are making a JSON object and are going to store it in database. After storing it database we are going to delete our contexts by

```
agent.context.delete('awaiting_title');
agent.context.delete('awaiting_description');
agent.context.delete('getDescription-followup');
```

Last step in this file is we are going to export these function to *index.js*.

- [x] MongoDB
- [x] ExpressJS
- [ ] Dialogflow

# writing dialogflow intents

> Agent - Agent is a term to refer to chatbot.

> Entities - 'Entities' are Dialogflow's mechanism for identifying and extracting useful data from natural language inputs.

> Actions & Parameters - They serve as a method to identify/annotate the keywords/values in the training phrases by connecting them with Entities.

> Webhook - webhooks are user-defined HTTP callbacks that get triggered when specific events take place on an external website or service.

We are going to write 7 intents. They are:
- Default Welcome Intent
- Default Fallback Intent
- Register Complaint
- Get Mobile Number
- Get Title
- Get Description
- Confirm Form Yes

FollowUp intent for the above 7 intent if mapped to `rejectForm()` function in intent.js. Last step is completed.

- [x] MongoDB
- [x] ExpressJS
- [x] Dialogflow

# Connecting NodeJS with dialogflow

- open `cmd` and start your server in development mode `npm run dev`.
- open another `cmd` and start ngrok with command `ngrok http 8080` (8080 port specified in index.js). ngrok will create a public URL for our webhook. 
- copy the public URL.
- open dialogflow in browser and go to Fulfillment tab and paste the URL with `/dialogflow` route. (https://e9122ab84595.ngrok.io/dialogflow).

Your connection in done.

# Integration

- open integration tab in dialogflow
- select Web Demo and open link provided.
- Now you can converse with your chatbot


Your Chatbot is completed! Now it can respond to your request.