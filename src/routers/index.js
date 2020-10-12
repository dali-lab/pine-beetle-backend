import countyPredictions from './county-predictions';
import healthcheck from './healthcheck';
import rangerDistrictPredictions from './ranger-district-predictions';
import spots from './spots';
import summarizedCounty from './summarized-county';
import summarizedRangerDistrict from './summarized-ranger-district';
import unsummarized from './unsummarized';
import user from './user';

export default {
  'county-prediction': countyPredictions,
  healthcheck,
  'rd-prediction': rangerDistrictPredictions,
  'spot-data': spots,
  'summarized-county-trapping': summarizedCounty,
  'summarized-rangerdistrict-trapping': summarizedRangerDistrict,
  'unsummarized-trapping': unsummarized,
  user,
};
