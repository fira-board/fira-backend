import mongoose, { Schema, Document } from 'mongoose';

interface IProjectUserRoles extends Document {
    projectId: typeof Schema.Types.ObjectId;
    userId: typeof Schema.Types.ObjectId;
    role: number;
}

const projectUserRolesSchema: Schema = new Schema({
    projectId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Project' // Assuming you have a Project model
    },
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User' // Assuming you have a User model
    },
    role: {
        type: Number,
        required: true,
        enum: [1, 2, 3] // 1 for read, 2 for write, 3 for owner
    }
});

const ProjectUserRoles = mongoose.model<IProjectUserRoles>('ProjectUserRoles', projectUserRolesSchema);
export default ProjectUserRoles;
