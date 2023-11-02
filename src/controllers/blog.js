import { RESPONSE_CODES } from '../constants';
import { Blog } from '../models';

/**
 * @description retrieves all blog post objects
 * @returns {Promise<Array<Blog>>} promise that resolves to blog posts array or error
 */
export const getBlogPosts = async () => {
  try {
    const posts = await Blog.find({});
    if (posts) return posts;
    return RESPONSE_CODES.NOT_FOUND;
  } catch (error) {
    console.log(error);
    return error;
  }
};

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
 * @description creates blog post object in database
 * @param {Object} fields blog post fields (title, body, imgUrl)
 * @returns {Promise<Blog>} promise that resolves to blog object or error
 */
export const createBlogPost = async (fields, user) => {
  const { title, body, imgUrl } = fields;

  const post = new Blog();

  const { first_name: firstName, last_name: lastName, _id: id } = user;

  post.title = title;
  post.body = body;
  post.img_url = imgUrl || null;
  post.author = `${firstName} ${lastName}`;
  post.authorId = id;

  try {
    const savedPost = await post.save();
    return savedPost;
  } catch (error) {
    console.log(error);

    throw new Error({
      code: RESPONSE_CODES.INTERNAL_ERROR,
      error,
    });
  }
};

/**
 * @description update blog post object
 * @param {Object} fields blog post fields (title, body, imgUrl)
 * @param {String} id blog post id
 * @returns {Promise<Blog>} promise that resolves to blog object or error
 */
export const updateBlogPost = async (id, fields) => {
  const { id: providedId, _id: providedUnderId } = fields;

  // reject update of id
  if (providedId || providedUnderId) {
    throw new Error({
      code: RESPONSE_CODES.BAD_REQUEST,
      error: { message: 'Cannot update blog post id' },
    });
  }

  try {
    await Blog.updateOne({ _id: id }, fields);

    const blogPost = await Blog.findById(id);

    await blogPost.save();

    return {
      ...RESPONSE_CODES.SUCCESS,
      blogPost,
    };
  } catch (error) {
    console.log(error);

    throw new Error({ code: RESPONSE_CODES.INTERNAL_ERROR }, error);
  }
};

/**
 * @description removes blog post with given id
 * @param {String} id blog post id
 * @returns {Promise<Blog>} promise that resolves to success object or error
 */
export const deleteBlogPost = async (id) => {
  try {
    await Blog.deleteOne({ _id: id });
    return RESPONSE_CODES.SUCCESS;
  } catch (error) {
    console.log(error);
    return error;
  }
};
