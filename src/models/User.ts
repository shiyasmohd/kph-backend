import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  userId: string;
  name: string;
  email: string;
  profilePicture?: string;
  tripIds: string[];
  friends: string[];
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    profilePicture: {
      type: String,
      default: null
    },
    tripIds: [{
      type: String,
      ref: 'Trip'
    }],
    friends: [{
      type: String,
      ref: 'User'
    }]
  },
  {
    timestamps: true
  }
);

UserSchema.index({ email: 1 });
UserSchema.index({ userId: 1 });

export default mongoose.model<IUser>('User', UserSchema);