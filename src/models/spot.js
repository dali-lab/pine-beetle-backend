/* for storing Spot Data
 * Sample allows you to import data from partners' excel sheet on model
 */
import mongoose, { Schema } from 'mongoose';

const SpotSchema = new Schema({
	YEAR: String,
	FIPS_NUM: Number,
	STATE: String,
	COUNTY: String,
	TSPOT: Number,
	HOST_AC: Number,
	SMACRE: Number,
	OUTBREAK: Number,
}, {
	toJSON: {
		virtuals: true,
	},

});


const SpotDataModel = mongoose.model('SpotData', SpotSchema);
export default SpotDataModel;