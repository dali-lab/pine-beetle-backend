/* all historical data is in src/data/SPB2016_toDALI.csv
 * identical info as SPB2016_toDALI.json, converted for convenience
 */
import HistoricalData from '../models/historical';

<<<<<<< HEAD
=======

>>>>>>> 8f9dcbef5b2f9a7c19b41a714708c200836444c0
const getHistoricalData = () => {
	return HistoricalData.find({})
};

<<<<<<< HEAD
const getHistoricalDataFilter = (findObject) => {
	// grab start and end year provided by user
	var startDate = findObject.startDate;
	var endDate = findObject.endDate;

	// find all values with matching fields in the parameters
	var data = HistoricalData.find(findObject);

	// query on year (allowing for range)
	if (startDate !== undefined && endDate !== undefined) {
		data = data.where('year').gte(startDate);
		data = data.where('year').lte(endDate);
	}
	else if (startDate !== undefined) {
		data = data.where('year').gte(startDate);
	}
	else if (endDate !== undefined) {
		data = data.where('year').lte(endDate);
	}

	return data;
};

// returns the first year found in the database
const getMinimumYear = () => {
	return HistoricalData.find({}).sort("year").limit(1)
};

// returns the most recent year found in the database
const getMaximumYear = () => {
	return HistoricalData.find({}).sort("-year").limit(1)
};

// returns all unique states in the database
const getUniqueStates = () => {
	return HistoricalData.distinct('state')
};

// returns all unique years in the database
const getUniqueYears = () => {
	return HistoricalData.distinct('year')
};

// returns all unique years in the database
const getUniqueNationalForests = (stateAbbreviation) => {
	return HistoricalData.find({
		state: stateAbbreviation
	}).distinct('nf')
};

// returns all unique years in the database
const getUniqueLocalForests = (stateAbbreviation) => {
	return HistoricalData.find({
		state: stateAbbreviation
	}).distinct('forest')
};

// previous stuff is below
=======
>>>>>>> 8f9dcbef5b2f9a7c19b41a714708c200836444c0
const uploadHistorical = async (historicalData) => {
	let dataArray = [];
	console.log(historicalData)
	historicalData.forEach((historicalObj) => {
		const historicalImport = {};
<<<<<<< HEAD

=======
		
>>>>>>> 8f9dcbef5b2f9a7c19b41a714708c200836444c0
		historicalImport.yearNumber = historicalObj["YearNum"]
		historicalImport.state = historicalObj["STATE"]
		historicalImport.nf = historicalObj["NF"]
		historicalImport.classification = historicalObj["Classification"]
		historicalImport.forest = historicalObj["Forest"]
		historicalImport.stateCode = historicalObj["StateCode"]
		historicalImport.forestCode = historicalObj["ForestCode"]
		historicalImport.latitude = historicalObj["latitude"]
		historicalImport.longitude = historicalObj["longitude"]
		historicalImport.host = historicalObj["Host 1000ha"]
		historicalImport.year = historicalObj["Year"]
		historicalImport.spbPerTwoWeeks = historicalObj["spb / trap / 14 d"]
		historicalImport.cleridsPerTwoWeeks = historicalObj["Clerids/ trap/ 14 d"]
		historicalImport.spots = historicalObj["Spots"]
		historicalImport.spotsPerHundredKm = isNaN(historicalObj["Spots/100km"]) ? null : historicalObj["Spots/100km"];
		historicalImport.percentSpb = historicalObj["%SPB"]

		dataArray.push(historicalImport);
	});

	HistoricalData.insertMany(dataArray, { ordered: false }, (err, docs) => {
		if (err) {
			console.log(err)
		} else {
			// console.log(docs)
		}
	});
}

<<<<<<< HEAD
const historical = { getHistoricalData, getHistoricalDataFilter, getMinimumYear, getMaximumYear, getUniqueStates, getUniqueYears, getUniqueNationalForests, getUniqueLocalForests, uploadHistorical }
=======


const historical = { getHistoricalData, uploadHistorical }
>>>>>>> 8f9dcbef5b2f9a7c19b41a714708c200836444c0
export default historical;
