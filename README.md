# Project Pine Beetle Backend

This is a Node server for interacting with the Pine Beetle Prediction client application.

## Project Overview

Project Pine Beetle is a web application that visualizes data on Southern Pine Beetle outbreaks in 16 states across the US. This tool uses a predictive model to predict future outbreaks and movements of Southern Pine Beetles.

On the frontend, this application provides valuable information for USFS researchers and state forest rangers to see information related to past outbreaks and predictions about future outbreaks. This application also provides information to the general public about threats facing their communities.

On the backend, this application aggregates data collected from USFS and state forest rangers on outbreaks and beetle counts, then uses those values to display historical data and future predictions. The predictive model used to generate predictions is written in R. All data is stored in a MongoDB database, allowing for easy pre and post-processing. Using an Express server, all calculations are made in JavaScript (outside of the predictive model and Mongo summarization/aggregation algorithms), and all data is stored in JSON format.

Project Pine Beetle is a collaboration between Professor Matt Ayres of Dartmouth College, Professor Carissa Aoki of Bates College, the United States Forest Service (USFS), and the Dartmouth Applied Learning and Innovation (DALI) Lab.

## Architecture

This web server uses [Express.js](https://expressjs.com/) to set up basic routing. We use [mongoose](https://www.npmjs.com/package/mongoose) for connecting and writing to our database, which is hosted with [MongoDB Atlas](https://www.mongodb.com/). We use [bcrypt](https://www.npmjs.com/package/bcrypt) for assisting with authentication.

We have two other repositories that comprise this application. Our [frontend](https://github.com/dali-lab/pine-beetle-frontend) is written with React and sends HTTP requests to this server to fetch data from the database and perform admin authentication actions. Our [automation server](https://github.com/dali-lab/pine-beetle-automation) is used for aggregating data from the USFS and restructuring it to our data format. Data comes from the USFS via several webhooks from [Survey123](https://survey123.arcgis.com/). See each of these repositories for more information.

## Setup

You must have [Node](https://nodejs.org) and [yarn](https://yarnpkg.com/) installed to run this project.

1. Clone the repository
2. `yarn install`
3. Add a `.env` file and paste in the necessary contents (see Handoff Document for this)
4. `yarn start` to run in the local development environment

## Repository Structure

```
src/
	constants/						[all constants and mapping files]
	controllers/					[controllers for performing CRUD on the models]
	middleware/						[middleware functions for each request]
	models/							[all data models]
	routers/						[all routers for exposing routes and calling controller functions]
	utils/							[utility functions]
	index.js						[server setup file]
.babelrc							[babel setup]
.eslintrc							[eslint setup]
package.json						[package]
```

### Data Flow

Requests come in via the routers defined in `routers/`. Each router is hooked up to the main server file (`src/index.js`). Each request may be prefixed with a middleware function if authentication is required to access the route.

This server only fetches data for each of the data collections (trapping, spot, and predictions). For user data and authentication, we perform reads and writes to the database.

For user data, the routers invoke one or more controller functions declared in `controllers/`. Each of the controller functions then use a mongoose data model from `models/` to perform database actions.

For the other database collections (not the user collection), the routers use the `queryFetch` utility function declared in `utils/` to perform a direct database read. This function takes in a collection name and optional filters, and retrieves the necessary data.

In both cases, the router then sends the fetched data back to the client. Each response is formatted like the following:

```json
{
  "status": <status code>,
  "type": <success or error type>,
  "data": <payload>,
  "error": <error object if one occurred>
}
```

### Authentication

We use bycrypt for performing auth mechanisms. A user signs up with an email and a password. We then salt and hash the password and store it in the database in the `salted_password` field on the user object. We then generate a JWT (JavaScript Web Token) and send that back to the client.

Authenticated requests send this JWT as a Bearer token in the authorization header to identify the user. We take this token and decode it to identify which user made the request.

When users login, they send their email and password. We then salt and hash the password and make sure it matches the stored `salted_password` in the database for the user that has that email. If it matches, we generate a JWT and send it to the client.

When users change their user data (including password), they must send their auth token (the JWT) in the authorization header. If the user sends an updated password, we re-salt and re-hash that new password and update the `salted_password` field. We always ensure the user is properly authenticated before performing these update actions.

No request to the frontend ever sends the `salted_password` field. We also keep the auth secret and salt rounds stored in environment variables, so as to keep the authentication process secure.

## Routes

See all available routes and their documentation [here](./docs/ROUTES.md).

## Code Style

We use async/await for all asynchronous functions.

## Deployment

Continuous deployment is setup with Heroku.

Merging a PR to the `dev` branch will trigger a new build in the dev environment. When the build passes, an update will be released at [https://pine-beetle-prediction-dev.herokuapp.com](https://pine-beetle-prediction-dev.herokuapp.com).

Merging a PR to the `release` branch will trigger a new build in the production environment. When the build passes, an update will be released at [https://pine-beetle-prediction.herokuapp.com](https://pine-beetle-prediction.herokuapp.com).

Pull requests should always be first merged into the `dev` branch so they are staged in the development environment. After smoke testing the changes in the development environment, developers can then choose to release those changes into production by generating a `DEV TO RELEASE` pull request from the `dev` branch to the `release` branch. One this single PR is merged into `release`, the changes will be built into the production environment and will be accessible at the production URL [https://pine-beetle-prediction.herokuapp.com](https://pine-beetle-prediction.herokuapp.com).

### Database Environments

When this server is running in the development environment, it connects to the development database in MongoDB Atlas. When this server is running in the production environment, it connects to the production database in MongoDB Atlas.

This is determined by the `MONGODB_URI` environment variable that is set in Heroku. The dev app uses the development database URI and the production app likewise uses the production database URI.

## Contributors

- Thomas Monfre
- Jeff Liu
- Angela Zhang

### Past Project Members

- Nathan Schneider
- John McCambridge
- Madeline Hess
- Isabel Hurley
- Anuj Varma
- Emma Langfitt
