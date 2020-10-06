import healthcheck from './healthcheck';
import spots from './spots';
import summarizedCounty from './summarized-county';
import summarizedRangerDistrict from './summarized-ranger-district';
import unsummarized from './unsummarized';
import user from './user';

export default {
  healthcheck,
  'spot-data': spots,
  'summarized-county-trapping': summarizedCounty,
  'summarized-rangerdistrict-trapping': summarizedRangerDistrict,
  'unsummarized-trapping': unsummarized,
  user,
};
