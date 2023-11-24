import mongoose from 'mongoose';
import { RESPONSE_CODES } from '../constants';
import { Blog } from '../models';
import { getFilePath } from '../utils/upload-file';

/**
 * @description retrieves blog post object
 * @param {String} id blog post id
 * @returns {Promise<Blog>} promise that resolves to blog post object or error
 */
export const getBlogPostById = async (id) => {
  try {
    const blogPost = await Blog.findById(id);

    if (blogPost) {
      return {
        ...RESPONSE_CODES.SUCCESS,
        blogPost,
      };
    }
    return RESPONSE_CODES.NOT_FOUND;
  } catch (error) {
    console.log(error);
    return RESPONSE_CODES.NOT_FOUND;
  }
};

/**
 * @description retrieves blog all blog posts by given author
 * @param {String} id author id
 * @returns {Promise<Blog[]>} promise that resolves to blog post objects array or error
 */
export const getBlogPostsByAuthorId = async (id) => {
  try {
    const blogPosts = await Blog.find({ authorId: id });

    if (blogPosts) {
      return {
        ...RESPONSE_CODES.SUCCESS,
        blogPosts,
      };
    }
    return RESPONSE_CODES.NOT_FOUND;
  } catch (error) {
    console.error(error);
    return RESPONSE_CODES.NOT_FOUND;
  }
};

/**
 * @description creates blog post object in database
 * @param {Object} fields blog post fields (title, body)
 * @param {File} uploadedFile the image that was uploaded by the user
 * @param {Object} user user who created the blog post
 * @returns {Promise<Blog>} promise that resolves to blog object or error
 */
export const createBlogPost = async (fields, uploadedFile, user) => {
  const { title, body } = fields;

  const post = new Blog();

  const { first_name: firstName, last_name: lastName, _id: id } = user;

  const imagePath = getFilePath(uploadedFile?.path);

  post.title = title;
  post.body = body;
  post.author = `${firstName} ${lastName}`;
  post.authorId = id;
  post.image = imagePath;

  try {
    const savedPost = await post.save();
    return savedPost.toJSON();
  } catch (error) {
    if (error.name === 'ValidationError') {
      if (error.errors.title) {
        const errorToThrow = new Error(error.errors.title.properties.message);
        errorToThrow.code = RESPONSE_CODES.VALIDATION_ERROR;
        throw errorToThrow;
      } else if (error.errors.body) {
        const errorToThrow = new Error(error.errors.body.properties.message);
        errorToThrow.code = RESPONSE_CODES.VALIDATION_ERROR;
        throw errorToThrow;
      }
    }
    throw new Error({
      code: RESPONSE_CODES.INTERNAL_ERROR,
      error,
    });
  }
};

/**
 * @description update blog post object
 * @param {Object} fields blog post fields (title, body, image)
 * @param {String} id blog post id
 * @returns {Promise<Blog>} promise that resolves to blog object or error
 */
export const updateBlogPost = async (id, fields, uploadedFile) => {
  const { id: providedId, _id: providedUnderId } = fields;

  // reject update of id
  if (providedId || providedUnderId) {
    throw new Error({
      code: RESPONSE_CODES.BAD_REQUEST,
      error: { message: 'Cannot update blog post id' },
    });
  }

  try {
    const postId = new mongoose.Types.ObjectId(id);

    await Blog.updateOne(
      { _id: postId },
      { ...fields, image: uploadedFile?.path || null },
    );

    const blogPost = await Blog.findById(postId);

    await blogPost.save();

    return {
      ...RESPONSE_CODES.SUCCESS,
      blogPost: blogPost.toJSON(),
    };
  } catch (error) {
    if (error.name === 'ValidationError') {
      if (error.errors.title) {
        const errorToThrow = new Error(error.errors.title.properties.message);
        errorToThrow.code = RESPONSE_CODES.VALIDATION_ERROR;
        throw errorToThrow;
      } else if (error.errors.body) {
        const errorToThrow = new Error(error.errors.body.properties.message);
        errorToThrow.code = RESPONSE_CODES.VALIDATION_ERROR;
        throw errorToThrow;
      }
    }
    throw new Error({
      code: RESPONSE_CODES.INTERNAL_ERROR,
      error,
    });
  }
};

/**
 * @description removes blog post with given id
 * @param {String} id blog post id
 * @param {String} userId id of a user who requests deletion
 * @returns {Promise<Blog>} promise that resolves to success object or error
 */
export const deleteBlogPost = async (id, userId) => {
  try {
    await Blog.deleteOne({ authorId: userId, _id: id });
    return RESPONSE_CODES.SUCCESS;
  } catch (error) {
    console.log(error);
    return error;
  }
};
