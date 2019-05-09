import axios from 'axios';
import queryURL from './buildQuery';

const getData = async (token) => {
  // console.log('getData running');

  // queryURL.getURL().then((url) => {
  // var token = url.access_token;
  // var token = 'vSKJelvkGRTJmZJQI4Tto8C6FusVP0R0BAqO-oaut7-WO98KANdFSGfxTO7JghnCwOVK1ArfkJK8-XUmwNdOcIn_Ja9r-0117_Bd40tL41uCpzjMMHPePOwI3up-x2XeSt2tTcQfAj4Ts7JOMUqpaMZCqsMSv-duT1EzibmoM038FoYwrN8KwYmcDBDgsxj7x7dO6sfzsct8hVKX0sqvsnLi1AzTPmNh4GtqhqU6i4M.';
  // console.log("token");
  // console.log(token)

  const survey123URL = `https://services3.arcgis.com/dOOr6AQOcTIg6tBw/arcgis/rest/services/service_e946164787a44d1b973f43cc96d889a3/FeatureServer/0/query?where=1%3D1&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&resultType=none&distance=0.0&units=esriSRUnit_Meter&returnGeodetic=false&outFields=*&returnGeometry=true&multipatchOption=xyFootprint&maxAllowableOffset=&geometryPrecision=&outSR=&datumTransformation=&applyVCSProjection=false&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&returnDistinctValues=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&having=&resultOffset=&resultRecordCount=&returnZ=false&returnM=false&returnExceededLimitFeatures=true&quantizationParameters=&sqlFormat=none&f=pjson&token=${  token}`;

  // console.log("survey123URL");
  // console.log(survey123URL)

  return axios.get(survey123URL);
  // })
};

// return axios.get(survey123URL);
// try {
//   console.log('getData running');
//   // console.log('survey123URL = ' + survey123URL);
//   return axios.get(survey123URL)
// } catch (error) {
//   console.error(error)
// }
// }
//
// const uploadData = async (dataToUpload) => {
//   return axios.post(localURL+'uploadSurvey123', dataToUpload);
// 	// try {
// 	// 	return axios.post(localURL+'uploadSurvey123', dataToUpload)
// 	// } catch (error) {
// 	// 	console.log(error)
// 	// }
// }

// const uploaded = getData().then((response) => {
// 	// console.log(response.data.features)
// 	const object = response.data.features
// 	uploadData(object).then((result) => {
// 		console.log(result)
// 	}).catch((err) => {
// 		console.log(err)
// 	})
// }).catch((error) => {
// 	console.log(error)
// })


const upload = { getData };
export default upload;
