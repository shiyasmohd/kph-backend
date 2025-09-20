"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const userController_1 = require("../controllers/userController");
const router = (0, express_1.Router)();
const handleValidationErrors = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }
    next();
};
router.post('/users', [
    (0, express_validator_1.body)('name').trim().notEmpty().withMessage('Name is required'),
    (0, express_validator_1.body)('email').isEmail().withMessage('Valid email is required'),
    (0, express_validator_1.body)('profilePicture').optional().isURL().withMessage('Profile picture must be a valid URL')
], handleValidationErrors, userController_1.createUser);
router.get('/users/:userId', [
    (0, express_validator_1.param)('userId').notEmpty().withMessage('User ID is required')
], handleValidationErrors, userController_1.getUser);
router.put('/users/:userId/profile-picture', [
    (0, express_validator_1.param)('userId').notEmpty().withMessage('User ID is required'),
    (0, express_validator_1.body)('profilePicture').isURL().withMessage('Valid profile picture URL is required')
], handleValidationErrors, userController_1.updateProfilePicture);
router.put('/users/:userId/friends', [
    (0, express_validator_1.param)('userId').notEmpty().withMessage('User ID is required'),
    (0, express_validator_1.body)('friendIds').isArray({ min: 1 }).withMessage('Friend IDs array is required'),
    (0, express_validator_1.body)('friendIds.*').isString().withMessage('Each friend ID must be a string')
], handleValidationErrors, userController_1.addFriends);
exports.default = router;
//# sourceMappingURL=userRoutes.js.map