import mongoose, { Schema } from 'mongoose';

const LikeSchema = new Schema(
  {
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog',
      required: [true, 'A like must be associated with a blog post'],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'A like must have a user'],
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
    timestamps: { createdAt: 'date_created' },
  },
);

// Ensure a user can only like a post once
LikeSchema.index({ postId: 1, userId: 1 }, { unique: true });

const LikeModel = mongoose.model('Like', LikeSchema);

export default LikeModel;



