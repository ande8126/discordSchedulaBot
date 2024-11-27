const pg = require( 'pg' );

//setup pg connection to db w/pool
const pool = new pg.Pool({
    database: 'patrickanderson',
    host: 'localhost',
    port: 5432,
    max: 10,
    idleTimeoutMillis: 20000 //20 seconds to connect
})

//setup for debugging
pool.on( 'connect', ()=>{
    console.log('connected to db')
})

pool.on( 'error', error =>{
    console.log('error connecting to db', error );
})

module.exports = pool;