const amqb = require('amqplib/callback_api');
const cors  = require('cors');
const express  = require('express');
const app  = express();

const  queuename  = 'tasks';


app.use(express.json());
app.use(cors({
    origin: '*'
}))
amqb.connect('amqp://localhost', (error , connection )=>{
    if(error) throw error;
    console.log("advanced message queue  protocol started successfully.");
    
    connection.createChannel(( error, mychannel)=>{
        if(error) throw error;
        mychannel.assertQueue(queuename);
        console.log("the rabbimq channel created successfully.")
        mychannel.consume(queuename, (message)=>{
             console.log("the consumer received the message from the server", message);
        })
        setTimeout(() => {
            mychannel.sendToQueue(queuename ,  new Buffer("hey message for the queue is here "))
            console.log("the  the produced the message for the queue system")
        }, 1000);
    });
})

const PORT  = 9000;
app.listen(PORT , ()=>{
    console.log("the app is listening on port "+ PORT);
})