import mongoose from 'mongoose';
import { RESPONSE_CODES } from '../constants';
import { Blog, Like } from '../models';
import { getOptionalUser } from './user';

/**
 * @description gets anonymous identifier from request (must be client-provided)
 * @param {Object} req request object
 * @returns {String|null} anonymous identifier or null if not provided
 */
const getAnonymousId = (req) => {
  return req.body?.anonymousId || req.headers['x-anonymous-id'] || null;
};

/**
 * @description retrieves all likes for a blog post
 * @param {String} postId blog post id
 * @param {Object} req request object (used to check if user is logged in)
 * @returns {Promise<Object>} promise that resolves to likes array or error
 */
export const getLikes = async (postId, req) => {
  try {
    const blogPost = await Blog.findById(postId);
    if (!blogPost) {
      return {
        ...RESPONSE_CODES.NOT_FOUND,
        error: { message: 'Blog post not found' },
      };
    }

    const likes = await Like.find({ postId })
      .populate('userId', 'first_name last_name email');

    let userHasLiked = false;
    const user = await getOptionalUser(req);
    const userId = user ? user._id : null;

    if (userId) {
      const userLike = await Like.findOne({ postId, userId });
      userHasLiked = !!userLike;
    } else {
      const anonymousId = getAnonymousId(req);
      if (anonymousId) {
        const anonymousLike = await Like.findOne({ postId, anonymousId });
        userHasLiked = !!anonymousLike;
      }
    }

    return {
      ...RESPONSE_CODES.SUCCESS,
      data: {
        likes,
        count: likes.length,
        userHasLiked,
      },
    };
  } catch (error) {
    console.error('Error getting likes:', error);
    return {
      ...RESPONSE_CODES.INTERNAL_ERROR,
      error: { message: 'Failed to retrieve likes', code: 'SERVER_ERROR' },
    };
  }
};

/**
 * @description toggles a like on a blog post (likes if not liked, unlikes if liked)
 * @param {String} postId blog post id
 * @param {Object} req request object (used to get user from JWT if available, or anonymousId from body/header)
 * @returns {Promise<Object>} promise that resolves to like/unlike result or error
 */
export const toggleLike = async (postId, req) => {
  try {
    const blogPost = await Blog.findById(postId);
    if (!blogPost) {
      return {
        ...RESPONSE_CODES.NOT_FOUND,
        error: { message: 'Blog post not found' },
      };
    }

    const user = await getOptionalUser(req);
    const userId = user ? user._id : null;
    let anonymousId = null;

    if (!userId) {
      anonymousId = getAnonymousId(req);
      if (!anonymousId) {
        return {
          ...RESPONSE_CODES.BAD_REQUEST,
          error: { message: 'Anonymous identifier (anonymousId) is required for non-logged-in users' },
        };
      }
    }

    const query = {
      postId: new mongoose.Types.ObjectId(postId),
    };

    if (userId) {
      query.userId = userId;
    } else {
      query.anonymousId = anonymousId;
    }

    const deleted = await Like.findOneAndDelete(query);

    if (deleted) {
      const count = await Like.countDocuments({ postId: new mongoose.Types.ObjectId(postId) });
      return {
        ...RESPONSE_CODES.SUCCESS,
        data: { liked: false, count },
      };
    }

    await Like.create({
      postId: new mongoose.Types.ObjectId(postId),
      userId,
      anonymousId,
    });
    const count = await Like.countDocuments({ postId: new mongoose.Types.ObjectId(postId) });

    return {
      ...RESPONSE_CODES.SUCCESS,
      data: {
        liked: true,
        count,
      },
    };
  } catch (error) {
    console.error('Error toggling like:', error);
    if (error.code === 11000) {
      return {
        ...RESPONSE_CODES.BAD_REQUEST,
        error: { message: 'You have already liked this post' },
      };
    }
    return {
      ...RESPONSE_CODES.INTERNAL_ERROR,
      error: { message: 'Failed to toggle like', code: 'SERVER_ERROR' },
    };
  }
};
