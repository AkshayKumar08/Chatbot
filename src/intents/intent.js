function welcome(agent) {
    agent.add('Hi, I am assistant. I can help you in various service. How can I help you today?');
}

function defaultFallback(agent) {
    agent.add('Sorry! I am unable to understand this at the moment. I am still learning humans. You can pick any of the service that might help me.');
}

function complaint(agent){
	agent.add('Please enter your Phone number');
}

async function getMobile(agent){
	
	const mobile = agent.parameters.mobile;
    const query = {
        mobile: mobile
    }
    try{
        const result = await db.collection('Users').findOne(query)
        if(!result)
            return agent.add('No User with Mobile number found!!!')
        agent.add(`Hello, ${result.username}. Please enter your issue Title. Start with title keyword`)
    }
    catch(err){
        console.log(err);
    }
}

async function getTitle(agent){
	try{
		agent.add(`Perfect!!. Enter your description. Start with 'description' keyword`);
	}
	catch(err){
		agent.add('Something went wrong. Please try again later');
	}
}


function getDescription(agent){
	try{
		agent.add('Do you want to confirm');
	}
	catch(err){
		agent.add('Something went wrong. Please try again later');
	}
}

async function getForm(agent){
	const confirm = agent.context.contexts.confirm;

	const mobile = confirm.parameters['mobile.original'];
	const title = confirm.parameters['title.original'];
	const description = confirm.parameters['desc.original'];
	const dateObj = new Date();
	const day = dateObj.getDate();
	const month = dateObj.getMonth()+1;
	const year = dateObj.getFullYear();
	const dateNow = day+'-'+month+'-'+year;
	const status = 'Pending';
	const trouble_ticket = Math.random().toString(36).slice(2);

	const query = {
		mobile: mobile
	};

	const Issue = {
        mobile: mobile,
        title: title,
        description: description,
        date: dateNow,
        status: status,
        trouble_ticket: trouble_ticket
    };
    
    try{
    	const User = await db.collection('Users').findOne(query)
    	const Result = await db.collection('Issues').insertOne(Issue)
    	agent.add(`your issue has been register on ${ Issue.date }.
    			title: ${ Issue.title } \n. 
    			description: ${ Issue.description } \n. 
    			Your trouble ticket is ${ Issue.trouble_ticket }`);
    }catch(err){
    	console.log(err);
    }

}

function rejectForm(agent) {
    agent.add('Your Issue was not registered');
    agent.context.delete('await_mobile');
    agent.context.delete('await_title');
    agent.context.delete('await_description');
}


module.exports = { welcome: welcome, defaultFallback: defaultFallback, complaint: complaint,
 getMobile: getMobile, getTitle: getTitle, getDescription: getDescription, getForm: getForm, rejectForm: rejectForm};