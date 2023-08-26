import mongoose, { Schema, Document } from 'mongoose';
import { ITask } from './types';

interface ITaskModel extends ITask, Document {}

const taskSchema = new Schema<ITaskModel>({
    title: {
        type: String,
        required: true
    },
    epic: {
        type: Schema.Types.ObjectId,
        ref: 'Epic'
    },
    status: {
        type: String,
        enum: ['Not Started', 'In Progress', 'Completed'],
        default: 'Not Started'
    },
    estimateDaysToFinish: Number,
});

const Task = mongoose.model<ITaskModel>('Task', taskSchema);
export default Task;
