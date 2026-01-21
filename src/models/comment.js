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
      required: false,
    },
    content: {
      type: String,
      required: [true, 'A comment must have content'],
      maxlength: [1000, 'Comment must be under 1000 characters'],
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
    timestamps: { createdAt: 'date_created', updatedAt: 'date_edited' },
  },
);

CommentSchema.index({ postId: 1 });

const CommentModel = mongoose.model('Comment', CommentSchema);

export default CommentModel;
