const express = require('express')
const router = express.Router()
const mongoUtil = require('../mongoUtil')


// Fetching all Users information
router.get('/search',  async (req, res) => {
    const mobile = req.query.mobile
    const query = {
        mobile: mobile
    }
    try{
        const result = await db.collection('Users').findOne(query)
        
        if(!result)
            return res.json({ message:'No User with Mobile number found!!!'})
        res.locals.mobile = mobile
        res.json(result)
    }
    catch(err){
        console.log(err);
    }
})

// Adding new User
router.post('/', (req, res) => {
    console.log(req.body)
    const mobile = req.body.mobile
    const username = req.body.username
    
    if(!mobile || !username){
        res.status(400).send('All fields should be filled')
        return
    }

    const User = {
        mobile: mobile,
        username: username
    }

    db.collection('Users').insertOne(User, function (err, result) {
        res.json('User added')
    })
})

// Update username using mobile number
router.put('/update', (req, res) => {
    const mobile = {
        mobile: req.body.mobile
    }
    console.log(mobile)
    const new_username = {
        $set:{
            username: req.body.username
        }
    }

    db.collection('Users').updateOne(mobile,     new_username, function (err, result){
        if(err) throw err;
        res.json(`user with ${mobile} is update. New username is ${req.body.username}`)
    })

})

// Delete username using mobile number
router.delete('/delete', (req, res) =>{
    const mobile = {
        mobile: req.body.mobile
    }
    db.collection('Users').deleteOne(mobile, function (err, result){
        if(err) throw err
        res.json(`user with mobile number '${req.body.mobile}' is deleted` )
    })
})

module.exports = router