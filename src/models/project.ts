import mongoose from 'mongoose';
import Task from './task';
import { IProject } from './types';

const projectSchema = new mongoose.Schema<IProject>({
    name: {
        type: String,
        required: true
    },
    description: String,
    resources: [String],
    epics: [String],
    tasks: [Task.schema],
    userId: {type:String, required:true},
    contributors: [String],
});

const Project = mongoose.model('Project', projectSchema);
export default Project;
