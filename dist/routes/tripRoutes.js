"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const tripController_1 = require("../controllers/tripController");
const router = (0, express_1.Router)();
const handleValidationErrors = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }
    next();
};
router.post('/trips', [
    (0, express_validator_1.body)('userId').notEmpty().withMessage('User ID is required'),
    (0, express_validator_1.body)('startDate').isISO8601().toDate().withMessage('Valid start date is required'),
    (0, express_validator_1.body)('endDate').isISO8601().toDate().withMessage('Valid end date is required'),
    (0, express_validator_1.body)('from').trim().notEmpty().withMessage('Origin location is required'),
    (0, express_validator_1.body)('destination').trim().notEmpty().withMessage('Destination is required'),
    (0, express_validator_1.body)('transportation')
        .isIn(['flight', 'car', 'train', 'bus', 'ship', 'other'])
        .withMessage('Valid transportation method is required')
], handleValidationErrors, tripController_1.addTrip);
router.put('/trips/:tripId', [
    (0, express_validator_1.param)('tripId').notEmpty().withMessage('Trip ID is required'),
    (0, express_validator_1.body)('startDate').optional().isISO8601().toDate().withMessage('Valid start date is required'),
    (0, express_validator_1.body)('endDate').optional().isISO8601().toDate().withMessage('Valid end date is required'),
    (0, express_validator_1.body)('from').optional().trim().notEmpty().withMessage('Origin location cannot be empty'),
    (0, express_validator_1.body)('destination').optional().trim().notEmpty().withMessage('Destination cannot be empty'),
    (0, express_validator_1.body)('transportation')
        .optional()
        .isIn(['flight', 'car', 'train', 'bus', 'ship', 'other'])
        .withMessage('Valid transportation method is required')
], handleValidationErrors, tripController_1.updateTrip);
router.get('/users/:userId/trips', [
    (0, express_validator_1.param)('userId').notEmpty().withMessage('User ID is required')
], handleValidationErrors, tripController_1.getUserTrips);
exports.default = router;
//# sourceMappingURL=tripRoutes.js.map