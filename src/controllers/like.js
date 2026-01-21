import mongoose from 'mongoose';
import { RESPONSE_CODES } from '../constants';
import { Blog, Like } from '../models';
import { getUserByJWT } from './user';

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
    if (req.headers.authorization) {
      try {
        const user = await getUserByJWT(req.headers.authorization);
        if (user && typeof user === 'object' && user._id) {
          const userLike = await Like.findOne({ postId, userId: user._id });
          userHasLiked = !!userLike;
        }
      } catch (error) {
        const anonymousId = getAnonymousId(req);
        if (anonymousId) {
          const anonymousLike = await Like.findOne({ postId, anonymousId });
          userHasLiked = !!anonymousLike;
        }
      }
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

    let userId = null;
    let anonymousId = null;

    if (req.headers.authorization) {
      try {
        const user = await getUserByJWT(req.headers.authorization);
        if (user && typeof user === 'object' && user._id) {
          userId = user._id;
        }
      } catch (error) {
        // Continue as anonymous
      }
    }

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

    const existingLike = await Like.findOne(query);

    if (existingLike) {
      await Like.deleteOne({ _id: existingLike._id });
      const count = await Like.countDocuments({ postId: new mongoose.Types.ObjectId(postId) });

      return {
        ...RESPONSE_CODES.SUCCESS,
        data: {
          liked: false,
          count,
        },
      };
    }

    const like = new Like();
    like.postId = new mongoose.Types.ObjectId(postId);
    like.userId = userId;
    like.anonymousId = anonymousId;

    await like.save();
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
