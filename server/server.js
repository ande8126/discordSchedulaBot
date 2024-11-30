//set up server connection

const express = require('express');
const bodyParser = require( 'body-parser' );
const app = express();
const port = process.env.APIPORT;

//setup body-parser to translate body to JSON
app.use( bodyParser.urlencoded({ extended: true }));

app.use( express.static( 'server/public' ) );

//spin up and listen
app.listen( port, ()=>{
    console.log('server is up on port', port);
})