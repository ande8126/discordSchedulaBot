//bring in express
const express = require( 'express' );
const router = express.Router();
const pool = require( '../pool' );

//Get route to show events
router.get( '/', ( req, res )=>{
    console.log( 'in eventsRoute GET' );
    let queryText = `SELECT eventname, eventdate, eventtime, description, owner, assigner FROM events ORDER BY id;`;
    pool.query( queryText )
    .then( results =>{
        //send back results from task list
        res.send( results.rows );
    })
    .catch(error=>{
        console.log( 'error getting back from events', error );
        res.sendStatus( 500 );
    })
}) 

//POST route to allow users to send new events to db
router.post( '/', ( req, res )=>{
    //bring in post from client with req.body
    let newEvent = req.body;
    console.log( 'in eventsRoute POST', req.body );
    //send query over to db
    let queryText = `INSERT INTO events (eventname, eventdate, eventtime, description, assigner, owner, channel, server) VALUES ($1, $2, $3, $4, $5, $6, $7, $8);`;
    pool.query( queryText, [newEvent.eventname, newEvent.eventdate, newEvent.eventtime, newEvent.description, newEvent.assigner, newEvent.owner, newEvent.channel, newEvent.server])
    .then( (results)=>{
        //send status-created
        res.sendStatus( 201 );
    })
    .catch( (error)=>{
        console.log( 'error getting back from events', error );
        res.sendStatus( 500 );
    })
})