import { Request, Response } from 'express';
import Trip from '../models/Trip';
import User from '../models/User';
import { v4 as uuidv4 } from 'uuid';

export const addTrip = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, startDate, endDate, from, destination, transportation } = req.body;

    const user = await User.findOne({ userId });
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const tripId = uuidv4();

    const newTrip = new Trip({
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
  } catch (error) {
    console.error('Error creating trip:', error);
    if (error instanceof Error && error.name === 'ValidationError') {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Failed to create trip' });
    }
  }
};

export const updateTrip = async (req: Request, res: Response): Promise<void> => {
  try {
    const { tripId } = req.params;
    const updateData = req.body;

    const allowedUpdates = ['startDate', 'endDate', 'from', 'destination', 'transportation'];
    const updates = Object.keys(updateData)
      .filter(key => allowedUpdates.includes(key))
      .reduce((obj: any, key) => {
        if (key === 'startDate' || key === 'endDate') {
          obj[key] = new Date(updateData[key]);
        } else if (key === 'transportation') {
          obj[key] = updateData[key].toLowerCase();
        } else {
          obj[key] = updateData[key];
        }
        return obj;
      }, {});

    if (Object.keys(updates).length === 0) {
      res.status(400).json({ error: 'No valid fields to update' });
      return;
    }

    const updatedTrip = await Trip.findOneAndUpdate(
      { tripId },
      updates,
      { new: true, runValidators: true }
    );

    if (!updatedTrip) {
      res.status(404).json({ error: 'Trip not found' });
      return;
    }

    res.status(200).json({
      message: 'Trip updated successfully',
      trip: updatedTrip
    });
  } catch (error) {
    console.error('Error updating trip:', error);
    if (error instanceof Error && error.name === 'ValidationError') {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Failed to update trip' });
    }
  }
};

export const getUserTrips = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;

    const trips = await Trip.find({ userId }).sort({ startDate: -1 });

    res.status(200).json({
      message: 'Trips fetched successfully',
      trips
    });
  } catch (error) {
    console.error('Error fetching trips:', error);
    res.status(500).json({ error: 'Failed to fetch trips' });
  }
};