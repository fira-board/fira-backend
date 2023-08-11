import mongoose from 'mongoose';
import { ITask } from './types';

const taskSchema = new mongoose.Schema<ITask>({
    title: {
        type: String,
        required: true
    },
    description: String,
    resource: String,
    epic: String,
    status: {
        type: String,
        enum: ['Not Started', 'In Progress', 'Completed'],
        default: 'Not Started'
    },
    estimateDaysToFinish: Number,
});

const Task = mongoose.model('Task', taskSchema);
export default Task;
