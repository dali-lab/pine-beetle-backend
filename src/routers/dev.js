import { Router } from 'express';

const devRouter = Router();

devRouter.route('/')
  .get((req, res) => {
    res.send('dev router');
  });

export default devRouter;
