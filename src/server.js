import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';
import morgan from 'morgan';
import mongoose from 'mongoose';
import router from './router';
<<<<<<< HEAD
require('dotenv').config() // load environment variables
=======
>>>>>>> 8f9dcbef5b2f9a7c19b41a714708c200836444c0

// DB Setup
// NOTE this is where collection is named/which database we direct app to
const localMongoConnection = 'mongodb://localhost/pb-dev';
const mongoURI = process.env.MONGODB_URI || localMongoConnection;
<<<<<<< HEAD
mongoose.connect(mongoURI, {useNewUrlParser: true});
=======
mongoose.connect(mongoURI);
>>>>>>> 8f9dcbef5b2f9a7c19b41a714708c200836444c0
// set mongoose promises to es6 default
mongoose.Promise = global.Promise;

// initialize
const app = express();

<<<<<<< HEAD
//enable cross origin resource sharing
app.use(cors());

=======
>>>>>>> 8f9dcbef5b2f9a7c19b41a714708c200836444c0
// enable/disable http request logging
app.use(morgan('dev'));

// enable only if you want static assets from folder static
app.use(express.static('static'));

// enable json message body for posting data to API, extend default size limit
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyParser.json({ limit: '50mb', extended: true }));
// app.use(bodyParser)

// prefix API endpoints
app.use('/v1', router);

// START THE SERVER
// =============================================================================
const port = process.env.PORT || 9090;
app.listen(port);

console.log(`listening on: ${port}`);
exports.localMongoConnection = localMongoConnection;
exports.mongoURI = mongoURI;
