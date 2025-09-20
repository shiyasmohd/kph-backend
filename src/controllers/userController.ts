import { Request, Response } from 'express';
import User from '../models/User';
import { v4 as uuidv4 } from 'uuid';

export const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, profilePicture } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ error: 'User with this email already exists' });
      return;
    }

    const userId = uuidv4();

    const newUser = new User({
      userId,
      name,
      email,
      profilePicture: profilePicture || null,
      tripIds: [],
      friends: []
    });

    const savedUser = await newUser.save();

    res.status(201).json({
      message: 'User created successfully',
      user: savedUser
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
};

export const getUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;

    const user = await User.findOne({ userId });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
};

export const updateProfilePicture = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const { profilePicture } = req.body;

    if (!profilePicture) {
      res.status(400).json({ error: 'Profile picture URL is required' });
      return;
    }

    const updatedUser = await User.findOneAndUpdate(
      { userId },
      { profilePicture },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.status(200).json({
      message: 'Profile picture updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Error updating profile picture:', error);
    res.status(500).json({ error: 'Failed to update profile picture' });
  }
};

export const addFriends = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const { friendIds } = req.body;

    if (!Array.isArray(friendIds) || friendIds.length === 0) {
      res.status(400).json({ error: 'Friend IDs array is required' });
      return;
    }

    const user = await User.findOne({ userId });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const validFriendIds: string[] = [];
    for (const friendId of friendIds) {
      const friendExists = await User.findOne({ userId: friendId });
      if (friendExists && !user.friends.includes(friendId) && friendId !== userId) {
        validFriendIds.push(friendId);
      }
    }

    if (validFriendIds.length === 0) {
      res.status(400).json({ error: 'No valid friend IDs to add' });
      return;
    }

    user.friends.push(...validFriendIds);
    const updatedUser = await user.save();

    res.status(200).json({
      message: 'Friends added successfully',
      addedFriends: validFriendIds,
      user: updatedUser
    });
  } catch (error) {
    console.error('Error adding friends:', error);
    res.status(500).json({ error: 'Failed to add friends' });
  }
};