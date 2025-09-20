import { Router } from 'express';
import { body, param, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import {
  createUser,
  getUser,
  updateProfilePicture,
  addFriends
} from '../controllers/userController';

const router = Router();

const handleValidationErrors = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }
  next();
};

router.post(
  '/users',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('profilePicture').optional().isURL().withMessage('Profile picture must be a valid URL')
  ],
  handleValidationErrors,
  createUser
);

router.get(
  '/users/:userId',
  [
    param('userId').notEmpty().withMessage('User ID is required')
  ],
  handleValidationErrors,
  getUser
);

router.put(
  '/users/:userId/profile-picture',
  [
    param('userId').notEmpty().withMessage('User ID is required'),
    body('profilePicture').isURL().withMessage('Valid profile picture URL is required')
  ],
  handleValidationErrors,
  updateProfilePicture
);

router.put(
  '/users/:userId/friends',
  [
    param('userId').notEmpty().withMessage('User ID is required'),
    body('friendIds').isArray({ min: 1 }).withMessage('Friend IDs array is required'),
    body('friendIds.*').isString().withMessage('Each friend ID must be a string')
  ],
  handleValidationErrors,
  addFriends
);

export default router;