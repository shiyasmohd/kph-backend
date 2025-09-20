import { Router } from 'express';
import { body, param, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import {
  addTrip,
  updateTrip,
  getUserTrips
} from '../controllers/tripController';

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
  '/trips',
  [
    body('userId').notEmpty().withMessage('User ID is required'),
    body('startDate').isISO8601().toDate().withMessage('Valid start date is required'),
    body('endDate').isISO8601().toDate().withMessage('Valid end date is required'),
    body('from').trim().notEmpty().withMessage('Origin location is required'),
    body('destination').trim().notEmpty().withMessage('Destination is required'),
    body('transportation')
      .isIn(['flight', 'car', 'train', 'bus', 'ship', 'other'])
      .withMessage('Valid transportation method is required')
  ],
  handleValidationErrors,
  addTrip
);

router.put(
  '/trips/:tripId',
  [
    param('tripId').notEmpty().withMessage('Trip ID is required'),
    body('startDate').optional().isISO8601().toDate().withMessage('Valid start date is required'),
    body('endDate').optional().isISO8601().toDate().withMessage('Valid end date is required'),
    body('from').optional().trim().notEmpty().withMessage('Origin location cannot be empty'),
    body('destination').optional().trim().notEmpty().withMessage('Destination cannot be empty'),
    body('transportation')
      .optional()
      .isIn(['flight', 'car', 'train', 'bus', 'ship', 'other'])
      .withMessage('Valid transportation method is required')
  ],
  handleValidationErrors,
  updateTrip
);

router.get(
  '/users/:userId/trips',
  [
    param('userId').notEmpty().withMessage('User ID is required')
  ],
  handleValidationErrors,
  getUserTrips
);

export default router;