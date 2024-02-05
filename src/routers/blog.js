import { Router } from 'express';
import {
  COLLECTION_NAMES,
  RESPONSE_CODES,
  RESPONSE_TYPES,
  generateResponse,
} from '../constants';
import { queryFetch, uploadFile } from '../utils';
import { Blog, User } from '../controllers';
import { requireAuth } from '../middleware';

const blogRouter = Router();

// get all blog posts
blogRouter.route('/').get(async (_req, res) => {
  try {
    const blogPosts = await queryFetch(COLLECTION_NAMES.blogPost);
    res.send(generateResponse(RESPONSE_TYPES.SUCCESS, blogPosts));
  } catch (error) {
    console.log(error);
  }
});

blogRouter
  .route('/:id')
  // given id, get blog post
  .get(async (req, res) => {
    try {
      const result = await Blog.getBlogPostById(req.params.id);

      if (result && result.status === 200) {
        res.send(
          generateResponse(RESPONSE_TYPES.SUCCESS, result.blogPost._doc),
        );
      } else {
        res.status(result.status || 500).send(generateResponse(result.type));
      }
    } catch (error) {
      console.log(error);
      res
        .status(RESPONSE_CODES.INTERNAL_ERROR.status)
        .send(generateResponse(RESPONSE_TYPES.INTERNAL_ERROR, error));
    }
  })
  // given id, update blog post
  .put([uploadFile, requireAuth], async (req, res) => {
    try {
      const result = await Blog.updateBlogPost(
        req.params.id,
        req.body,
        req.file,
      );

      if (result && result.status === 200) {
        return res.send(
          generateResponse(RESPONSE_TYPES.SUCCESS, result.blogPost),
        );
      } else {
        return res
          .status(result.status || 500)
          .send(generateResponse(result.type));
      }
    } catch (error) {
      return res
        .status(error.code.status)
        .send(generateResponse(error.code.type, error.message));
    }
  })
  // given id, delete blog post
  .delete(requireAuth, async (req, res) => {
    const user = await User.getUserByJWT(req.headers.authorization);
    try {
      const result = await Blog.deleteBlogPost(req.params.id, user._id);

      if (result && result.status === 200) {
        res.send(generateResponse(RESPONSE_TYPES.SUCCESS));
      } else {
        res.status(result.status || 500).send(generateResponse(result.type));
      }
    } catch (error) {
      console.log(error);
      res
        .status(RESPONSE_CODES.INTERNAL_ERROR.status)
        .send(generateResponse(RESPONSE_TYPES.INTERNAL_ERROR, error));
    }
  });

// given JSON body of blog post info, create blog post object
blogRouter
  .route('/create')
  .post([uploadFile, requireAuth], async (req, res) => {
    try {
      const user = await User.getUserByJWT(req.headers.authorization);

      if (user) {
        const post = await Blog.createBlogPost(
          req.body,
          req.file || null,
          user,
        );

        return res.send(
          generateResponse(RESPONSE_TYPES.SUCCESS, {
            blogPost: post,
          }),
        );
      } else {
        return res
          .status(RESPONSE_CODES.UNAUTHORIZED)
          .send(RESPONSE_TYPES.UNAUTHORIZED, {
            message: 'User must be logged in to create a blog post',
          });
      }
    } catch (error) {
      return res
        .status(error.code.status)
        .send(generateResponse(error.code.type, error.message));
    }
  });

blogRouter.route('/user/:id').get(async (req, res) => {
  try {
    const result = await Blog.getBlogPostsByAuthorId(req.params.id);

    if (result && result.status === 200) {
      res.send(generateResponse(RESPONSE_TYPES.SUCCESS, result.blogPosts));
    } else {
      res.status(result.status || 500).send(generateResponse(result.type));
    }
  } catch (error) {
    console.error(error);

    res
      .status(RESPONSE_CODES.INTERNAL_ERROR.status)
      .send(generateResponse(RESPONSE_TYPES.INTERNAL_ERROR, error));
  }
});

export default blogRouter;
