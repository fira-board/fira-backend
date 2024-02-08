
import { Response } from "express";
import { SessionRequest } from "supertokens-node/framework/express";
import supertokens from "supertokens-node";
import UserData from "../models/userData";
import { BlobServiceClient } from '@azure/storage-blob';
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(__dirname, "../.env") });


const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING!;
const containerName = 'profile-pictures';
const crypto = require('crypto');




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
    const update: { name?: string; } = {};
    if (req.body.name) {
        update.name = req.body.name;
    }

    const user = await UserData.findOneAndUpdate({ userId: userId }, update);

    if (!user) {
        return res.status(404).send("User not found");
    }

    return res.json(user);
};

// uploadProfilePicture function is used to upload the profile picture of the user to the server
export const uploadProfilePicture = async (req: SessionRequest, res: Response) => {
    const userId = req.session!.getUserId();
    const profilePicture = req.file;

    if (!profilePicture) {
        return res.status(400).send("No file uploaded");
    }

    uploadProfilePictureUsingAzure(userId, profilePicture).then((url) => {
        const update = { profilePicture: url };
        UserData.findOneAndUpdate({ userId: userId }, update).then(() => { res.json({ profilePicture: url }) });
    });
}

const uploadProfilePictureUsingAzure = async (userId: string, profilePicture: any) => {
    const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const hashedUserID = hashUserID(userId);
    const blobName = `profile_${hashedUserID}.png`;

    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    // Upload the file
    await blockBlobClient.uploadFile(profilePicture, profilePicture.data.length);
    return blockBlobClient.url;
}

function hashUserID(userID: string) {
    return crypto.createHash('sha256').update(userID).digest('hex');
}
