import mongoose, { Schema, Document } from 'mongoose';
import { IResource } from './types';

interface IResourceModel extends IResource, Document {}

const resourceSchema = new Schema<IResourceModel>({
    title: {
        type: String,
        required: true
    },
    epics: [{
        type: Schema.Types.ObjectId,
        ref: 'Epic'
    }],
    project: String,
});

const Resource = mongoose.model<IResourceModel>('Resource', resourceSchema);
export default Resource;
