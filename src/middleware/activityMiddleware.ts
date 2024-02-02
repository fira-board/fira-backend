
import { Response, NextFunction } from 'express';
import { SessionRequest } from "supertokens-node/framework/express";
import Activity from "../models/activity";

function trackActivity(activityType: string, itemType: string) {
    return async (req: SessionRequest, res: Response, next: NextFunction) => {
        const userId = req.session!.getUserId();
        const projectId = req.params.projectId;
        const itemId = req.params.id;

        await new Activity({
            userId: userId,
            projectId: projectId,
            itemId: itemId,
            item: itemType,
            type: activityType
        }).save();

        next();
    }
}
export default trackActivity;