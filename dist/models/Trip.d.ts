import mongoose, { Document } from 'mongoose';
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
declare const _default: mongoose.Model<ITrip, {}, {}, {}, mongoose.Document<unknown, {}, ITrip, {}, {}> & ITrip & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=Trip.d.ts.map