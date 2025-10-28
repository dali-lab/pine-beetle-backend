import compression from 'compression';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan';
import path from 'path';
import routers from './routers';

import { generateResponse, RESPONSE_TYPES } from './constants';

dotenv.config({ silent: true });

// DB Setup
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost/pb-dev';

const mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  loggerLevel: 'error',
};

// connect mongoose and mongodb
mongoose
  .connect(mongoURI, mongooseOptions)
  .then(() => {
    console.log('mongoose connected to database');

    global.connection = mongoose.connection;
    console.log('mongo client connected with mongoose');
  })
  .catch((err) => {
    console.log('error: mongoose could not connect to db:', err);
  });

// initialize
const app = express();

// Trust proxy to get real IP addresses (for Heroku, AWS, etc.)
app.set('trust proxy', true);

// enable cross origin resource sharing
// app.use(cors());

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
  credentials: false
}));

// use gzip compression
app.use(compression());

// additional header specifications
app.use((_req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept',
  );
  next();
});

// enable/disable http request logging
app.use(morgan('dev'));

app.use(express.json({ extended: true, limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve static files from the public/uploads directory
app.use(
  '/v3/uploads',
  express.static(path.join(__dirname, '../public/uploads')),
);

// ROUTES
Object.entries(routers).forEach(([prefix, router]) => {
  app.use(`/v3/${prefix}`, router);
});

// custom 404 middleware
app.use((_req, res) => {
  res
    .status(404)
    .send(
      generateResponse(
        RESPONSE_TYPES.NOT_FOUND,
        'The requested route does not exist',
      ),
    );
});

// START THE SERVER
// =============================================================================
const port = process.env.PORT || 9090;
app.listen(port);

console.log(`listening on: ${port}`);
