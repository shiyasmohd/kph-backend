"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserTrips = exports.updateTrip = exports.addTrip = void 0;
const Trip_1 = __importDefault(require("../models/Trip"));
const User_1 = __importDefault(require("../models/User"));
const uuid_1 = require("uuid");
const addTrip = async (req, res) => {
    try {
        const { userId, startDate, endDate, from, destination, transportation } = req.body;
        const user = await User_1.default.findOne({ userId });
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }
        const tripId = (0, uuid_1.v4)();
        const newTrip = new Trip_1.default({
            tripId,
            userId,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            from,
            destination,
            transportation: transportation.toLowerCase()
        });
        const savedTrip = await newTrip.save();
        user.tripIds.push(tripId);
        await user.save();
        res.status(201).json({
            message: 'Trip created successfully',
            trip: savedTrip
        });
    }
    catch (error) {
        console.error('Error creating trip:', error);
        if (error instanceof Error && error.name === 'ValidationError') {
            res.status(400).json({ error: error.message });
        }
        else {
            res.status(500).json({ error: 'Failed to create trip' });
        }
    }
};
exports.addTrip = addTrip;
const updateTrip = async (req, res) => {
    try {
        const { tripId } = req.params;
        const updateData = req.body;
        const allowedUpdates = ['startDate', 'endDate', 'from', 'destination', 'transportation'];
        const updates = Object.keys(updateData)
            .filter(key => allowedUpdates.includes(key))
            .reduce((obj, key) => {
            if (key === 'startDate' || key === 'endDate') {
                obj[key] = new Date(updateData[key]);
            }
            else if (key === 'transportation') {
                obj[key] = updateData[key].toLowerCase();
            }
            else {
                obj[key] = updateData[key];
            }
            return obj;
        }, {});
        if (Object.keys(updates).length === 0) {
            res.status(400).json({ error: 'No valid fields to update' });
            return;
        }
        const updatedTrip = await Trip_1.default.findOneAndUpdate({ tripId }, updates, { new: true, runValidators: true });
        if (!updatedTrip) {
            res.status(404).json({ error: 'Trip not found' });
            return;
        }
        res.status(200).json({
            message: 'Trip updated successfully',
            trip: updatedTrip
        });
    }
    catch (error) {
        console.error('Error updating trip:', error);
        if (error instanceof Error && error.name === 'ValidationError') {
            res.status(400).json({ error: error.message });
        }
        else {
            res.status(500).json({ error: 'Failed to update trip' });
        }
    }
};
exports.updateTrip = updateTrip;
const getUserTrips = async (req, res) => {
    try {
        const { userId } = req.params;
        const trips = await Trip_1.default.find({ userId }).sort({ startDate: -1 });
        res.status(200).json({
            message: 'Trips fetched successfully',
            trips
        });
    }
    catch (error) {
        console.error('Error fetching trips:', error);
        res.status(500).json({ error: 'Failed to fetch trips' });
    }
};
exports.getUserTrips = getUserTrips;
//# sourceMappingURL=tripController.js.map