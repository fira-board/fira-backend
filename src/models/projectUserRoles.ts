import mongoose, { Schema, Document, Types } from 'mongoose';
import { IProject } from './project';


// The type Ref<T> is either an ObjectId or the full type T
type Ref<T extends Document> = T | Types.ObjectId;

interface IProjectUserRoles extends Document {
    projectId: Ref<IProject>;
    userId: String;
    role: number;
}

const projectUserRolesSchema: Schema = new Schema({
    projectId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'project' // Assuming you have a Project model
    },
    userId: {
        type: String,
        required: true
    },
    role: {
        type: Number,
        required: true,
        enum: [1, 2, 3] // 1 for read, 2 for write, 3 for owner
    },
    projectIsDeleted: {
        type: Boolean,
        default: false,
        required: true,
    },
});

const ProjectUserRoles = mongoose.model<IProjectUserRoles>('ProjectUserRoles', projectUserRolesSchema);
export default ProjectUserRoles;
