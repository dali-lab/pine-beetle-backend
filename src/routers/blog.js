import { Router } from 'express';
import {
  COLLECTION_NAMES,
  RESPONSE_CODES,
  RESPONSE_TYPES,
  generateResponse,
  extractCredentialsFromAuthorization,
} from '../constants';
import { queryFetch } from '../utils';
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
  .put(requireAuth, async (req, res) => {
    try {
      const result = await Blog.updateBlogPost(req.params.id, req.body);

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
  // given id, delete blog post
  .delete(requireAuth, async (req, res) => {
    try {
      const result = await Blog.deleteBlogPost(req.params.id);

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
blogRouter.route('/create').post(requireAuth, async (req, res) => {
  const credentials = extractCredentialsFromAuthorization(
    req.headers.authorization,
  );

  try {
    const isAuthed = await User.isAuthedUser(credentials);

    if (isAuthed.result) {
      const post = await Blog.createBlogPost(req.body, isAuthed.user);

      return res.send(
        generateResponse(RESPONSE_TYPES.SUCCESS, {
          blogPost: post._doc,
        }),
      );
    } else {
      res
        .status(RESPONSE_CODES.UNAUTHORIZED)
        .send(RESPONSE_TYPES.UNAUTHORIZED, {
          message: 'User must be logged in to create a blog post',
        });
    }
  } catch (error) {
    console.log(error);

    return res
      .status(RESPONSE_CODES.INTERNAL_ERROR.status)
      .send(generateResponse(RESPONSE_TYPES.INTERNAL_ERROR, error));
  }
});

export default blogRouter;
