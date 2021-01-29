const express = require('express')

const { WebhookClient } = require("dialogflow-fulfillment");
const intent = require('./intents/intent')

const bodyParser = require('body-parser')
const home = require('./routes/home')
const users = require('./routes/users')


const app = express();

app.use(bodyParser.json())
const mongoUtil = require('./mongoUtil');

app.post("/dialogflow", express.json(), async (req, res) => {
    const agent = new WebhookClient({ request: req, response: res });
    let intentMap = new Map();
    intentMap.set("Default Welcome Intent", intent.welcome);    
    intentMap.set("Default Fallback Intent", intent.defaultFallback);
    intentMap.set("Register Complaint", intent.complaint);
    intentMap.set("Get Mobile Number", intent.getMobile);
    intentMap.set("Get Title", intent.getTitle);
    intentMap.set("Get Description", intent.getDescription);
    intentMap.set("Confirm Form Yes", intent.getForm);
    intentMap.set("Confirm Form No", intent.rejectForm);
    intentMap.set("Register Complaint - no", intent.rejectForm);
    intentMap.set("Get Title - no", intent.rejectForm);
    try{
    	return await agent.handleRequest(intentMap);
	}
	catch(err){
		console.log(err);
	}
    
});

app.use(home)
app.use('/users', users)

const PORT = process.env.PORT || 8080
app.listen(PORT, () => console.info(`Server is listening on ${PORT}`))