import axios from 'axios'

const survey123URL = "https://services3.arcgis.com/dOOr6AQOcTIg6tBw/arcgis/rest/services/service_e946164787a44d1b973f43cc96d889a3/FeatureServer/0/query?where=1%3D1&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&resultType=none&distance=0.0&units=esriSRUnit_Meter&returnGeodetic=false&outFields=*&returnGeometry=true&multipatchOption=xyFootprint&maxAllowableOffset=&geometryPrecision=&outSR=&datumTransformation=&applyVCSProjection=false&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&returnDistinctValues=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&having=&resultOffset=&resultRecordCount=&returnZ=false&returnM=false&returnExceededLimitFeatures=true&quantizationParameters=&sqlFormat=none&f=pjson&token=dYmkESNqFyVrj3IQGHgFe563buQZyxTcI9Ax8_Q-AgG-Yf1nlRSQjTfBoE-ODavu5kbPuZEyan4HJjPBGdOKZtytwXc-O_j3wOT-amM-07mYbsNEhDu5mhsuiGi_yEYd_ymK63RcUVSoAx9uPys1UCkgrqSXcXIAV8RjkHWg0DgWp_JRnEbB88uCKfNQLY_ZFfHNl-PdPTf0tqvLTZgfGTYYDf6Lvslc7rDDvKfccdk."
// "https://services3.arcgis.com/dOOr6AQOcTIg6tBw/arcgis/rest/services/service_e946164787a44d1b973f43cc96d889a3/FeatureServer/0/query?where=1%3D1&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&resultType=none&distance=0.0&units=esriSRUnit_Meter&returnGeodetic=false&outFields=*&returnGeometry=true&multipatchOption=xyFootprint&maxAllowableOffset=&geometryPrecision=&outSR=&datumTransformation=&applyVCSProjection=false&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&returnDistinctValues=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&having=&resultOffset=&resultRecordCount=&returnZ=false&returnM=false&returnExceededLimitFeatures=true&quantizationParameters=&sqlFormat=none&f=html&token=dYmkESNqFyVrj3IQGHgFe563buQZyxTcI9Ax8_Q-AgG-Yf1nlRSQjTfBoE-ODavu5kbPuZEyan4HJjPBGdOKZtytwXc-O_j3wOT-amM-07mYbsNEhDu5mhsuiGi_yEYd_ymK63RcUVSoAx9uPys1UCkgrqSXcXIAV8RjkHWg0DgWp_JRnEbB88uCKfNQLY_ZFfHNl-PdPTf0tqvLTZgfGTYYDf6Lvslc7rDDvKfccdk."
// "https://services3.arcgis.com/dOOr6AQOcTIg6tBw/arcgis/rest/services/service_e946164787a44d1b973f43cc96d889a3/FeatureServer/0/query?where=1%3D1&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&resultType=none&distance=0.0&units=esriSRUnit_Meter&returnGeodetic=false&outFields=&returnGeometry=true&multipatchOption=xyFootprint&maxAllowableOffset=&geometryPrecision=&outSR=&datumTransformation=&applyVCSProjection=false&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&returnDistinctValues=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&having=&resultOffset=&resultRecordCount=&returnZ=false&returnM=false&returnExceededLimitFeatures=true&quantizationParameters=&sqlFormat=none&f=pjson&token=7ELw4CZZWpL-jIBkxhlO4PKKYTFNBHM7xk1OYXxhkF-INMSnbbQ127bqSLUHVPt29H3UN-G73Er4-YywScoANeQDpLNgkS_8zMU7S8grMfIANkUeqxexolfb5FBsJ6HWwV6IBK7TZg2Up-MxDd8MFRsUPyiNqxa8XhVtObFuxOZI9UbR1kav13sAjf4v1Vn2cm91RORZ69ANpY_8ofLePyoI7sEEcRXy1UP23jIa9Z8.d8MFRsUPyiNqxa8XhVtObFuxOZI9UbR1kav13sAjf4v1Vn2cm91RORZ69ANpY_8ofLePyoI7sEEcRXy1UP23jIa9Z8.";
// "https://services3.arcgis.com/dOOr6AQOcTIg6tBw/arcgis/rest/services/service_e946164787a44d1b973f43cc96d889a3/FeatureServer/0/query?where=1%3D1&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&resultType=none&distance=0.0&units=esriSRUnit_Meter&returnGeodetic=false&outFields=&returnGeometry=true&multipatchOption=xyFootprint&maxAllowableOffset=&geometryPrecision=&outSR=&datumTransformation=&applyVCSProjection=false&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&returnDistinctValues=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&having=&resultOffset=&resultRecordCount=&returnZ=false&returnM=false&returnExceededLimitFeatures=true&quantizationParameters=&sqlFormat=none&f=pjson&token=MTOJoUsv2FGl0IJ1t603gLW1cwHJhJS_Abg4bPZ6707ToN08w25LbvaNjOfw9TbtPTsuSHoFHQG1LyaRS1u-EOQACFg6e8mhD0b7SKmOfHjJczj254Scc5ZJZDybXN9kAk6NxcwZ2cdZkrkOEdPZpYiDKP8nTCvf4CmT0ZAeNYx9m-i0yDk4TBuo9oYr3u8G27yFClbuiJj7srPhs_mERQUBIJ2-qiDjmGvXDRvzEw8."
// "https://services3.arcgis.com/dOOr6AQOcTIg6tBw/arcgis/rest/services/service_765fc8be50884d29b37ee120d68ea6de/FeatureServer/0/query?where=1%3D1&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&resultType=none&distance=0.0&units=esriSRUnit_Meter&returnGeodetic=false&outFields=*&returnGeometry=true&multipatchOption=xyFootprint&maxAllowableOffset=&geometryPrecision=&outSR=&datumTransformation=&applyVCSProjection=false&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&returnDistinctValues=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&having=&resultOffset=&resultRecordCount=&returnZ=false&returnM=false&returnExceededLimitFeatures=true&quantizationParameters=&sqlFormat=none&f=pjson";
//&token=Vu9Bl12svq_wPtrqq4g9kMoAWLRTo4pflWh2IoAaOwqZsg4VngH9wGifWLQG318zY9YNjJNISwWVsuiIuw7dTKO63_9qP2Skt6gqXZaLFonTqV1SkrMwYHk1Wv1TTC5ZvlgACKMsUZCE_fAOpHSgfSVQSW0ZQDtzw3gwv0D8UqXGAMaHWN71qPAM7bTGAZa_DA8f2lpY9rA6P8WZBkp_ZIGno7YJh6Ry_n8amM2sFVk
const localURL = "http://localhost:9090/v1/"
//TODO setup switch between local and deployed

const getData = async () => {
  console.log('getData running');

  return axios.get(survey123URL);
  // try {
  //   console.log('getData running');
  //   // console.log('survey123URL = ' + survey123URL);
  //   return axios.get(survey123URL)
  // } catch (error) {
  //   console.error(error)
  // }
}

const uploadData = async (dataToUpload) => {
  return axios.post(localURL+'uploadSurvey123', dataToUpload);
	// try {
	// 	return axios.post(localURL+'uploadSurvey123', dataToUpload)
	// } catch (error) {
	// 	console.log(error)
	// }
}

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
