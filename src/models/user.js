import mongoose, { Schema } from 'mongoose';

const UserSchema = new Schema({
  email: String,
  salted_password: String,
  first_name: String,
  last_name: String,
}, {
  toJSON: {
    virtuals: true,
  },
});

const UserModel = mongoose.model('User', UserSchema);

export default UserModel;
