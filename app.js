require('dotenv').config({path: __dirname + '/config/config.env'});

const express = require('express');
const morgan = require('morgan');
const bodyParser = require( 'body-parser' );
const helmet = require( 'helmet' );

const connectDB = require("./config/db");
const auth = require("./middleware/auth");

const app = express();

//middleware/controllers

app.use(express.json());
app.use(morgan("tiny"));
app.use(helmet());
app.use(require('cors')());
app.use(bodyParser.json());

// //routes
// app.get("/protected", auth, (req, res) => {
//     return res
//             .status(200)
//             .json({...req.user._doc})
// })

// app.use("/api", require("./src/routes/auth"));
// app.use("/api", require("./src/routes/Prospect"));

//server config
const PORT = process.env.PORT || 8000;
// app.listen(PORT, async()=> {
//     try {
//         await connectDB();
//         console.log(`server listening on port: ${PORT}`);
//     } catch (err) {
//         console.log(err)
//     } 
// });

const { server } = require( './config/server' );
server.listen( PORT ).on( 'error', ( err ) => {
    console.log( '✘ Application failed to start' );
    console.error( '✘', err.message );
    process.exit( 0 );
} ).on( 'listening', async () => {
    console.log( '✔ Application Started' );
    await connectDB();
} );


module.exports = { server };