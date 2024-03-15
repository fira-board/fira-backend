
import { Response } from "express";
import { SessionRequest } from "supertokens-node/framework/express";
import supertokens from "supertokens-node";
import UserData from "../models/userData";
import { BlobServiceClient } from '@azure/storage-blob';
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { promisify } from "util";

dotenv.config({ path: path.join(__dirname, "../.env") });


const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING!;
const containerName = 'profile-pictures';


const unlinkAsync = promisify(fs.unlink);



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
        timeJoineds: userInfo.timeJoined,
        allowedTokens: userData!.allowedTokens,
        consumedTokens: userData!.consumedTokens,
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
        return res.status(400).send("No file uploaded. Please upload an image of type png, jpg or jpeg and size less than 5MB");
    }

    console.log(`user ${userId} is uploading profile picture.`);

    const url = await uploadProfilePictureUsingAzure(profilePicture);

    const update = { profilePicture: url };
    await UserData.findOneAndUpdate({ userId: userId }, update)
    await unlinkAsync(profilePicture.path);
    res.json({ profilePicture: url })
};


const uploadProfilePictureUsingAzure = async (profilePicture: any) => {
    const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blockBlobClient = containerClient.getBlockBlobClient(profilePicture.filename);
    // Upload the file
    await blockBlobClient.uploadFile(profilePicture.path);
    return blockBlobClient.url;
}