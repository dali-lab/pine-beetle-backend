var R = require("r-script");
import path from 'path';

var rpath = path.resolve(__dirname, './SPB-Predictions.v02.R');

export const makePredictions = (SPB, cleridst1, spotst1, spotst2, endobrev) => {
	var obj = R(rpath)
		.data({
			SPB,
			cleridst1,
			spotst1,
			spotst2,
			endobrev
		})
		.callSync();
	return(obj);
}
