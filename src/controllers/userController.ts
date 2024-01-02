
import { Response } from "express";
import { SessionRequest } from "supertokens-node/framework/express";
import supertokens from "supertokens-node";
import ProjectUserRoles from "../models/projectUserRoles";

export const getUserDetails = async (req: SessionRequest, res: Response) => {
    // Retrieve the userId from the session
    const userId = req.session!.getUserId();

    // Use the getUser function to retrieve user information
    const userInfo = await supertokens.getUser(userId);

    if (!userInfo) {
        throw new Error("User not found");
    }

    return res.json({
        email: userInfo.emails,
        name: userInfo.thirdParty, 
        timeJoineds: userInfo.timeJoined, 
    });
    
};

export const getProjectUserDetails = async (req: SessionRequest, res: Response) => {
    const projectId = req.params.projectId;

    const userRoles = await ProjectUserRoles.find({ projectId: projectId });

    let usersInfo = [];
    
    // Using for...of loop for async-await operations, loop each userRole for userId
    for (const userRole of userRoles) {
        const userInfo = await supertokens.getUser(String(userRole.userId));
        if (userInfo) {
            usersInfo.push(userInfo);
        }
    }

    return res.json(usersInfo);
};