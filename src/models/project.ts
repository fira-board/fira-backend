import mongoose, { Schema, Document } from 'mongoose';
import { IProject } from './types';

interface IProjectModel extends IProject, Document {}

const projectSchema = new Schema<IProjectModel>({
    name: {
        type: String,
        required: true
    },
    description: String,
    prompt: String,
    resources: [{
        type: Schema.Types.ObjectId,
        ref: 'Resource'
    }],
    userId: {
        type: String,
        required: true
    },
});

const Project = mongoose.model<IProjectModel>('Project', projectSchema);
export default Project;
