//Connect to DB
const url = 'mongodb://127.0.0.1:27017'
const dbName = 'Chatbot'
const MongoClient = require('mongodb').MongoClient

MongoClient.connect(url, {useUnifiedTopology: true}, async (err, client) => {
    try{
		db = await client.db(dbName);
        console.log(`Connected Database: ${url}`)
        console.log(`Database : ${dbName}`)
    }
    catch(err){
        console.log(err);
    }
});

module.exports = MongoClient;