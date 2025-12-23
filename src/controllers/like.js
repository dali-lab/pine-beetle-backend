import mongoose from 'mongoose';
import { RESPONSE_CODES } from '../constants';
import { Like, Blog } from '../models';
import { getUserByJWT } from './user';

/**
 * @description retrieves all likes for a blog post
 * @param {String} postId blog post id
 * @param {Object} req request object (used to check if user is logged in)
 * @returns {Promise<Object>} promise that resolves to likes array or error
 */
export const getLikes = async (postId, req) => {
  try {
    // Verify blog post exists
    const blogPost = await Blog.findById(postId);
    if (!blogPost) {
      return {
        ...RESPONSE_CODES.NOT_FOUND,
        error: { message: 'Blog post not found' },
      };
    }

    const likes = await Like.find({ postId })
      .populate('userId', 'first_name last_name email');

    // Check if current user has liked the post
    let userHasLiked = false;
    if (req.headers.authorization) {
      try {
        const user = await getUserByJWT(req.headers.authorization);
        if (user) {
          const userLike = await Like.findOne({ postId, userId: user._id });
          userHasLiked = !!userLike;
        }
      } catch (error) {
        // User not authenticated, ignore
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
 * @param {Object} req request object (used to get user from JWT)
 * @returns {Promise<Object>} promise that resolves to like/unlike result or error
 */
export const toggleLike = async (postId, req) => {
  try {
    // Verify blog post exists
    const blogPost = await Blog.findById(postId);
    if (!blogPost) {
      return {
        ...RESPONSE_CODES.NOT_FOUND,
        error: { message: 'Blog post not found' },
      };
    }

    // Get user from JWT
    let user;
    try {
      user = await getUserByJWT(req.headers.authorization);
    } catch (error) {
      return {
        ...RESPONSE_CODES.UNAUTHORIZED,
        error: { message: 'User must be logged in to like a post' },
      };
    }

    if (!user) {
      return {
        ...RESPONSE_CODES.UNAUTHORIZED,
        error: { message: 'User must be logged in to like a post' },
      };
    }

    const { _id: userId } = user;

    // Check if like already exists
    const existingLike = await Like.findOne({
      postId: new mongoose.Types.ObjectId(postId),
      userId,
    });

    if (existingLike) {
      // Unlike: remove the like
      await Like.deleteOne({ _id: existingLike._id });
      const remainingLikes = await Like.find({ postId });

      return {
        ...RESPONSE_CODES.SUCCESS,
        data: {
          liked: false,
          count: remainingLikes.length,
        },
      };
    }

    // Like: create new like
    const like = new Like();
    like.postId = new mongoose.Types.ObjectId(postId);
    like.userId = userId;

    await like.save();
    const allLikes = await Like.find({ postId });

    return {
      ...RESPONSE_CODES.SUCCESS,
      data: {
        liked: true,
        count: allLikes.length,
      },
    };
  } catch (error) {
    console.error('Error toggling like:', error);
    if (error.code === 11000) {
      // Duplicate key error (shouldn't happen due to index, but handle it)
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
