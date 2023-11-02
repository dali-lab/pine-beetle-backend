import mongoose, { Schema } from 'mongoose';

const BlogPostSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'A blog post must have a title'],
    },
    body: {
      type: String,
      required: [true, 'A blog post must have a body'],
    },
    author: {
      type: String,
      required: true,
    },
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    imgUrl: {
      type: String,
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
    timestamps: { createdAt: 'date_created', updatedAt: 'date_edited' },
  },
);

const BlogModel = mongoose.model('Blog', BlogPostSchema);

export default BlogModel;
