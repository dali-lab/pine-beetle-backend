import { Router } from 'express';

const healthcheckRouter = Router();

healthcheckRouter.route('/')
  .get((_req, res) => {
    res.send('v2 up!');
  });

export default healthcheckRouter;
