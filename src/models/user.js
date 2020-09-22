import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config({ silent: true });

const { SALT_ROUNDS } = process.env;

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

// pre-save schema for salting/hashing user password
UserSchema.pre('save', async function hashPassword(next) {
  const user = this;

  // only hash password if new/modified
  if (!user.isModified('salted_password')) return next();

  try {
    const salt = await bcrypt.genSalt(parseInt(SALT_ROUNDS, 10));
    const hash = await bcrypt.hash(user.salted_password, salt);

    user.salted_password = hash;
    return next();
  } catch (error) {
    console.log(error);
    return next(error);
  }
});

const UserModel = mongoose.model('User', UserSchema);

export default UserModel;
