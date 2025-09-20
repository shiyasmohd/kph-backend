import mongoose, { Schema, Document } from 'mongoose';

export interface ITrip extends Document {
  tripId: string;
  userId: string;
  startDate: Date;
  endDate: Date;
  from: string;
  destination: string;
  transportation: string;
  createdAt: Date;
  updatedAt: Date;
}

const TripSchema: Schema = new Schema(
  {
    tripId: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    userId: {
      type: String,
      required: true,
      ref: 'User',
      index: true
    },
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true,
      validate: {
        validator: function(this: ITrip, value: Date) {
          return value > this.startDate;
        },
        message: 'End date must be after start date'
      }
    },
    from: {
      type: String,
      required: true,
      trim: true
    },
    destination: {
      type: String,
      required: true,
      trim: true
    },
    transportation: {
      type: String,
      required: true,
      enum: ['flight', 'car', 'train', 'bus', 'ship', 'other'],
      lowercase: true
    }
  },
  {
    timestamps: true
  }
);

TripSchema.index({ userId: 1, startDate: -1 });
TripSchema.index({ tripId: 1 });

export default mongoose.model<ITrip>('Trip', TripSchema);