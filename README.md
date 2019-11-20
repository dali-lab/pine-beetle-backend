# Project Pine Beetle
Last Updated: 11.20.2019
## Table of Contents
- Project Overview
- Project Architecture
- Developer Information
- Project Status
- Authors
- Acknowledgements
## Project Overview
Project Pine Beetle is a web application that visualizes data on Southern Pine Beetle outbreaks in 16 states across the US. This tool uses a predictive model to predict future outbreaks and movements of Southern Pine Beetles.

On the front-end, this application provides valuable information for USFS researchers and state forest rangers to see information related to past outbreaks and predictions about future outbreaks. This application also provides information to the general public about threats facing their communities.

On the back-end, this application aggregates data collected from USFS and state forest rangers on outbreaks and beetle counts, then uses those values to display historical data and future predictions. The predictive model used to generate predictions is written in R. All data is stored in a NoSQL database, allowing for easy pre and post-processing. Using an Express server, all calculations are made in JavaScript (outside of the predictive model), and all data is stored in JSON format.

Project Pine Beetle is a collaboration between Professor Matt Ayres of Dartmouth College, Professor Carissa Aoki of Bates College, the United States Forest Service (USFS), and the Dartmouth Applied Learning and Innovation (DALI) Lab.

## Project Architecture
### Back-end
#### NoSQL Database:
Non-relational database built using MongoDB, responsible for storing data on pine beetle trappings and spots. The database was pre-populated with data collected from 1986-2010 which was stored locally and can be seen in the following [repository](https://github.com/dali-lab/pine-beetle-backend) in `src/data/`.

Additionally, future data is imported to the database from Survey123, a data collection platform built on top of ArcGIS. All entries drawn from Survey123 come in on a trap-level. Data is collected across a 4-6 week trapping period, then aggregated from a trap level to a forest level. The data is pulled from Survey123 to the database as trapping data comes in. Seeing the surveys and data from Survey123 is strictly closed to the public. All data is publicly accessible on the front-end.

#### Data:
Trapping data is entered in the spring. Spot data is entered in the fall. For information on variable names, see the back-end repository linked [here](https://github.com/dali-lab/pine-beetle-backend) in `src/models`.

Between Spring 2017 and Spring 2018, the USFS shifted over from manual data collection (Microsoft Excel) to data collection through Survey123, an online platform built on top of ArcGIS. A representation of the manually collected data can be seen in `src/data/` on the back-end, as well as within the database (currently closed to the public). Survey123 data is visible both through the database and through the Survey123 platform. Information on querying data from Survey123 and ArcGIS can be found [here](https://developers.arcgis.com/rest/services-reference/query-feature-service-layer-.html).

### Front-end
You can the front-end repository [here](https://github.com/dali-lab/pine-beetle-frontend).

## Developer Information
### Installation:
#### Tools:
- You will need [Node.js](https://nodejs.org/en/), [yarn](https://yarnpkg.com/en/), [mongo/mongoDB](https://www.mongodb.com/), and [heroku](https://www.heroku.com) installed locally in order to build, run and develop this project.

- Tool installation instructions (for mac, using homebrew)
	- `brew install node` (you will need version >=9.x and <= 10.x)
		- Note: for advanced usage, we also recommend installing Node.js via a version manager such as [nvm](https://github.com/creationix/nvm) instead of with homebrew. To do so, run `curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.34.0/install.sh | bash`. Be sure to set your `.bash_profile` file by following the instructions listed in the [nvm repository](https://github.com/creationix/nvm).
	- `brew install yarn`
	- `brew install mongo`
	- `brew install heroku/brew/heroku`
	- `brew install python`
	- `brew install R`

#### Back-end repository:
- For the back-end, run `git clone https://github.com/dali-lab/pine-beetle-backend`.
- `cd pine-beetle-backend`. Then make sure you are on the master branch.
- Install necessary packages and dependencies with `yarn install`.
- Start a local server with `yarn start`
- Build with `yarn build`
- Deploy using heroku by setting a remote and running `git push heroku master`

#### Contents
- `src/` contains the server and router
- `src/models` contains the data models for the database
- `src/controllers` contains the mongoose controllers
- `src/data` contains local copies of the initially imported data
- `src/importing-scripts` contains scripts used to manually upload data to the database as well as scripts for pulling Survey123 data. 

#### Exploring the DB
- Before you start anything, make sure mongo is installed correctly
- Run `mongod`
- Run `mongo`
- Run `use db`
- Explore database contents with calls such as `.find({})`

#### Adding Data to DB
To locally import the csv file in `src/data/`:
`mongoimport --db pb-dev --collection spot-prediction --type csv --headerline --file ./src/data/sample_import_data.csv`

#### Deployment
- Deploy to heroku by setting a remote: `heroku git:remote -a pine-beetle-prediction`. You must be signed into a Heroku account with access to this project to gain access.
- Then run `git push heroku master` to deploy and build.
- See [heroku deployment documentation](https://devcenter.heroku.com/articles/git) for more.

## Project Status
As of November 19th, 2019, Project Pine Beetle will not be under active development. It is intended to be under active development again starting in Winter 2020.

### Implemented: Fall, 2018
- Database in MongoDB developed
- Historical data (1986-2010) uploaded to DB
- Pipeline constructed for uploading Survey123 data to DB
- Frontend framework developed
- Data retrieval from database implemented
- Data handling on front-end implemented
- User selection tools implemented
- Rudimentary data visualization in map form implemented
- Rudimentary data wrangling implemented
- Predictive model implemented to run in R through JavaScript
- Model updating process implemented

### Implemented: Winter, 2019
- Finalized data pipeline from Survey123 to MongoDB
- Created numerous routes on the back-end to query and serve data to the front-end
- Constructed capability to run R model using various feature inputs as well with a year/state/forest combination.
- Created routes for running the R model and returning results to front-end
- Converted front-end to React.js
- Built full historical data visualization
- Built full predictive model page
- Implemented fresh redesigns
- Constructed private capability for partners to pull Survey123 data to the database

### Implemented: Fall, 2019
- Simplified code
- Restructured data models
- Enforced MVC model in backend
- Ensured functional pipeline from Survey123 to MongoDB

### Expected Implementation: Winter, 2020
- Automate pipeline from Survey123 to MongoDB for updated previously seen data
- Improve model
- Improve run/load-times
- Cache/store previous model runs on server or in database to both improve run times and allow future versions of the predictive model to use previous model runs as inputs
- Implement a CDN
- Improve historical data visualization and predictive model visualization
- Add more educational and explanatory features/information for the general public to learn about this problem and this tool
- Implement additional features requested by the partners


### Future Directions
This product illustrates the threats facing communities in a visual manner. It is well suited to visualize any epidemic or spreading threat. It could be generalized and implemented for visualizing risk of forest fires, spread of disease, genetic diversity, or any threat that is predictable, has the potential to propagate outward, and displays a set of observable qualities indicating risk. Southern Pine Beetles may be just the beginning to the uses of a tool like this.

## Team Members

### Fall 2019
- Amanda Bak, Project Manager
- Anuj Varma, Developer
- Emma Langfitt, Developer

### Fall 2018
- Thomas Monfre, Project Manager
- Madeline Hess, Developer
- Isabel Hurley, Developer

### Winter 2019
- Mo Zhu, Project Manager
- Thomas Monfre, Developer
- Madeline Hess, Developer
- Emi Hayakawa, Designer
- Bella Jacoby, Designer

## README Authors
Amanda Bak, Anuj Varma, Emma Langfitt.

## Acknowledgements
- This project was built in partnership with Professor Carissa Aoki of Bates College and Professor Matt Ayres of Dartmouth College. We thank them for approaching the DALI Lab and cooperating with us to build this product.
- We would like to thank many representatives from the US Forest Service and the Georgia Forestry Commission for their help, feedback and willingness to participate in user interviews. Particular thanks to Michael Torbett.
- Thank you to Tim Tregubov, Lorie Loeb, Natalie Jung, and Erica Lobel for their help, guidance, and advice.
- Shout out to Paula Mendoza for guiding us during the first part of this project. The direction of the final product is in large part the result of your positive, guiding influence. Thanks!
- Model for writing up this README drawn from https://github.com/dartmouth-cs98/18w-si32
