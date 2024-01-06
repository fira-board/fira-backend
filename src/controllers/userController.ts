
import { Response } from "express";
import { SessionRequest } from "supertokens-node/framework/express";
import supertokens from "supertokens-node";
import UserData from "../models/userData";

export const getUserDetails = async (req: SessionRequest, res: Response) => {
    // Retrieve the userId from the session
    const userId = req.session!.getUserId();

    // Use the getUser function to retrieve user information
    const userInfo = await supertokens.getUser(userId);

    if (!userInfo) {
        throw new Error("User not found");
    }

    const userData = await UserData.findOne({
        userId: userId,
      })

    return res.json({
        email: userInfo.emails,
        name: userData!.name, 
        profilePicture: userData?.profilePicture,
        timeJoineds: userInfo.timeJoined
   });
    
};

export const editUserDetails = async (req: SessionRequest, res: Response) => {
    // Retrieve the userId from the session
    const userId = req.session!.getUserId();

    // Construct the update object with inline type assertion
    const update: { name?: string; profilePicture?: string; } = {};
    if (req.body.name) {
        update.name = req.body.name;
    }
    if (req.body.profilePicture) {
        update.profilePicture = req.body.profilePicture;
    }

    const user = await UserData.findOneAndUpdate({ userId: userId}, update);
    
    if (!user) {
        return res.status(404).send("User not found");
    }

    return res.json(user);
};