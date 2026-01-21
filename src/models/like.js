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
      required: false,
    },
    anonymousId: {
      type: String,
      required: false,
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
    timestamps: { createdAt: 'date_created' },
  },
);

// Ensure a logged-in user can only like a post once (sparse index allows multiple null userIds)
LikeSchema.index({ postId: 1, userId: 1 }, { unique: true, sparse: true });
// Ensure an anonymous user can only like a post once per anonymousId
LikeSchema.index({ postId: 1, anonymousId: 1 }, { unique: true, sparse: true });

const LikeModel = mongoose.model('Like', LikeSchema);

export default LikeModel;
