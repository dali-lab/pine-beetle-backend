import healthcheck from './healthcheck';
import summarizedCounty from './summarized-county';
import summarizedRangerDistrict from './summarized-ranger-district';
import unsummarized from './unsummarized';
import user from './user';

export default {
  healthcheck,
  'summarized-counties': summarizedCounty,
  'summarized-rangerdistricts': summarizedRangerDistrict,
  'unsummarized-trapping': unsummarized,
  user,
};
