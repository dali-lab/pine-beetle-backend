/*
 * Pine Beetle Trappings (v2)
 * Based on Service Layer: service_e946164787a44d1b973f43cc96d889a3 (FeatureServer) > Pine_Beetle_Prediction_Trapping_2019
 */
import mongoose, { Schema } from 'mongoose';

// eslint-disable-next-line camelcase
const Spot_V2_Schema = new Schema({
  objectid: String,
  // globalid: String,
  latitude: Number,
  longitude: Number,
  SPB: Number,
  USA_State: String,
  County: String,
  forest: String, // not yet in system
  Nat_Forest_Ranger_Dist: String, // not yet in system
  is_Nat_Forest: Boolean, // not yet in system
  Year: Number,
  TrapSetDate: Number,
  Trap_name: Number,
  Cooperator: Number,
  Trap_Lure: Number,
  // Initial_Bloom: Number,
  // Species_Bloom: Number,
  // Comments: String,
  // DeleteSurvey: Number,
  CollectionDate1: Number,
  TrappingInterval1: Number,
  Number_SPB1: Number,
  Number_Clerids1: Number,
  SPB_Plus_Clerids1: Number,
  Percent_SPB1: Number,
  SPB_PerDay1: Number,
  Clerids_PerDay1: Number,
  CollectionDate2: Date,
  TrappingInterval2: Number,
  Number_SPB2: Number,
  Number_Clerids2: Number,
  SPB_Plus_Clerids2: Number,
  Percent_SPB2: Number,
  SPB_PerDay2: Number,
  Clerids_PerDay2: Number,
  CollectionDate3: Date,
  TrappingInterval3: Number,
  Number_SPB3: Number,
  Number_Clerids3: Number,
  SPB_Plus_Clerids3: Number,
  Percent_SPB3: Number,
  SPB_PerDay3: Number,
  Clerids_PerDay3: Number,
  CollectionDate4: Date,
  TrappingInterval4: Number,
  Number_SPB4: Number,
  Number_Clerids4: Number,
  SPB_Plus_Clerids4: Number,
  Percent_SPB4: Number,
  SPB_PerDay4: Number,
  Clerids_PerDay4: Number,
  CollectionDate5: Date,
  TrappingInterval5: Number,
  Number_SPB5: Number,
  Number_Clerids5: Number,
  SPB_Plus_Clerids5: Number,
  Percent_SPB5: Number,
  SPB_PerDay5: Number,
  Clerids_PerDay5: Number,
  CollectionDate6: Date,
  TrappingInterval6: Number,
  Number_SPB6: Number,
  Number_Clerids6: Number,
  SPB_Plus_Clerids6: Number,
  Percent_SPB6: Number,
  SPB_PerDay6: Number,
  Clerids_PerDay6: Number,
  Sum_TrappingInterval: Number,
  Sum_SPB: Number,
  Sum_Clerids: Number,
  Sum_SPB_Plus_Clerids: Number,
  Overall_PercentSPB: Number,
  Overall_SPB_PerDay: Number,
  Overall_Clerids_PerDay: Number,
  CreationDate: Date,
  Creator: String,
  EditDate: Date,
  Editor: String,
  Trapping_End_Date: Date,
  Num_Trapping_Periods: Number,
}, {
  toJSON: {
    virtuals: true,
  },

});


// eslint-disable-next-line camelcase
const Spot_V2 = mongoose.model('Spot', Spot_V2_Schema, 'spots');
// eslint-disable-next-line camelcase
export default Spot_V2;
