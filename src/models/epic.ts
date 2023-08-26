import mongoose, { Schema, Document } from 'mongoose';
import { IEpic } from './types';

interface IEpicModel extends IEpic, Document {}

const epicSchema = new Schema<IEpicModel>({
    title: {
        type: String,
        required: true
    },
    resource: {
        type: Schema.Types.ObjectId,
        ref: 'Resource'
    },
    tasks: [{
        type: Schema.Types.ObjectId,
        ref: 'Task'
    }],
    status: {
        type: String,
        enum: ['Not Started', 'In Progress', 'Completed'],
        default: 'Not Started'
    },
});

const Epic = mongoose.model<IEpicModel>('Epic', epicSchema);
export default Epic;
