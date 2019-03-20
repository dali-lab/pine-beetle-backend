import axios from 'axios'
import queryURL from './buildQuery';

const getData = async () => {
  console.log('getData running');

  // queryURL.getURL().then((url) => {
    //var token = url.access_token;
    var token = 'asCk1oGTJowciW9GaWdQgZCv-C-pF6T0Ds4pNQiIYEa2rsplKbPoDgzSFp0eLB372No1GPDsBoc7cAUNaoHrOZXFscDJsM0SE9wBPIMez8lfe1b6kFj3TzRoPo6YnbjM5ncdHY66zTwcSSA4d7ihi0-SRNfutkUhUtnkBJbLEnFkqtIig_YaITok1i4HKeABf95C4H0_y674CvAzxjkMaxeLKZRIWgmkudkS2TyXMR4.';
    // console.log("token");
    // console.log(token)

    const survey123URL = "https://services3.arcgis.com/dOOr6AQOcTIg6tBw/arcgis/rest/services/service_e946164787a44d1b973f43cc96d889a3/FeatureServer/0/query?where=1%3D1&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&resultType=none&distance=0.0&units=esriSRUnit_Meter&returnGeodetic=false&outFields=*&returnGeometry=true&multipatchOption=xyFootprint&maxAllowableOffset=&geometryPrecision=&outSR=&datumTransformation=&applyVCSProjection=false&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&returnDistinctValues=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&having=&resultOffset=&resultRecordCount=&returnZ=false&returnM=false&returnExceededLimitFeatures=true&quantizationParameters=&sqlFormat=none&f=pjson&token=" + token;

    // console.log("survey123URL");
    // console.log(survey123URL)

    return axios.get(survey123URL);
  // })
}

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
