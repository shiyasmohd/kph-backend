import mongoose, { Document } from 'mongoose';
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
declare const _default: mongoose.Model<IUser, {}, {}, {}, mongoose.Document<unknown, {}, IUser, {}, {}> & IUser & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=User.d.ts.map