import healthcheck from './healthcheck';
import summarizedCounty from './summarized-county';
import summarizedRangerDistrict from './summarized-ranger-district';
import unsummarized from './unsummarized';
import user from './user';
import blog from './blog';
import histogram from './histogram';

export default {
  healthcheck,
  'summarized-county': summarizedCounty,
  'summarized-rangerdistrict': summarizedRangerDistrict,
  'unsummarized-trapping': unsummarized,
  user,
  blog,
  histogram,
};
