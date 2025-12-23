import mongoose, { Schema } from 'mongoose';

const CommentSchema = new Schema(
  {
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog',
      required: [true, 'A comment must be associated with a blog post'],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'A comment must have an author'],
    },
    content: {
      type: String,
      required: [true, 'A comment must have content'],
    },
    author: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
    timestamps: { createdAt: 'date_created', updatedAt: 'date_edited' },
  },
);

const CommentModel = mongoose.model('Comment', CommentSchema);

export default CommentModel;
