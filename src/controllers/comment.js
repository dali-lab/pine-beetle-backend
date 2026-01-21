import mongoose from 'mongoose';
import { RESPONSE_CODES } from '../constants';
import { Blog, Comment } from '../models';
import { sanitizeToText } from '../utils';
import { getUserByJWT } from './user';

const MAX_COMMENT_LENGTH = 1000;

/**
 * @description retrieves all comments for a blog post
 * @param {String} postId blog post id
 * @param {Object} options query options (limit, offset, sort)
 * @returns {Promise<Object>} promise that resolves to comments array or error
 */
export const getComments = async (postId, options = {}) => {
  try {
    const { limit, offset, sort = 'date_created' } = options;

    // Verify blog post exists
    const blogPost = await Blog.findById(postId);
    if (!blogPost) {
      return {
        ...RESPONSE_CODES.NOT_FOUND,
        error: { message: 'Blog post not found' },
      };
    }

    const query = Comment.find({ postId }).sort({ [sort]: -1 });

    if (limit) {
      query.limit(parseInt(limit, 10));
    }
    if (offset) {
      query.skip(parseInt(offset, 10));
    }

    const comments = await query.populate('userId', 'first_name last_name email');

    return {
      ...RESPONSE_CODES.SUCCESS,
      data: comments,
    };
  } catch (error) {
    console.error('Error getting comments:', error);
    return {
      ...RESPONSE_CODES.INTERNAL_ERROR,
      error: { message: 'Failed to retrieve comments', code: 'SERVER_ERROR' },
    };
  }
};

/**
 * @description creates a comment on a blog post
 * @param {String} postId blog post id
 * @param {Object} body comment body with content
 * @param {Object} req request object (used to get user from JWT if available)
 * @returns {Promise<Object>} promise that resolves to comment object or error
 */
export const createComment = async (postId, body, req) => {
  try {
    const { content } = body;

    const cleaned = sanitizeToText(content);

    if (!cleaned) {
      return {
        ...RESPONSE_CODES.BAD_REQUEST,
        error: { message: 'Comment content is required' },
      };
    }

    if (cleaned.length > MAX_COMMENT_LENGTH) {
      return {
        ...RESPONSE_CODES.BAD_REQUEST,
        error: { message: `Comment must be under ${MAX_COMMENT_LENGTH} characters` },
      };
    }

    // Verify blog post exists
    const blogPost = await Blog.findById(postId);
    if (!blogPost) {
      return {
        ...RESPONSE_CODES.NOT_FOUND,
        error: { message: 'Blog post not found' },
      };
    }

    // Try to get user from JWT if available (optional for non-logged-in users)
    let userId = null;
    if (req.headers.authorization) {
      try {
        const user = await getUserByJWT(req.headers.authorization);
        if (user && typeof user === 'object' && user._id) {
          userId = user._id;
        }
      } catch (error) {
        // User not authenticated, continue as anonymous
      }
    }

    const comment = new Comment();
    comment.postId = new mongoose.Types.ObjectId(postId);
    comment.userId = userId;
    comment.content = cleaned;

    const savedComment = await comment.save();
    if (userId) {
      await savedComment.populate('userId', 'first_name last_name email');
    }

    return {
      ...RESPONSE_CODES.SUCCESS,
      status: 201,
      data: savedComment,
      message: 'Comment created successfully',
    };
  } catch (error) {
    console.error('Error creating comment:', error);
    if (error.name === 'ValidationError') {
      return {
        ...RESPONSE_CODES.BAD_REQUEST,
        error: { message: error.message },
      };
    }
    return {
      ...RESPONSE_CODES.INTERNAL_ERROR,
      error: { message: 'Failed to create comment', code: 'SERVER_ERROR' },
    };
  }
};
