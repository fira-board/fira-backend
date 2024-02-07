
import { Response } from "express";
import { SessionRequest } from "supertokens-node/framework/express";
import supertokens from "supertokens-node";
import UserData from "../models/userData";
import multer from 'multer';
import { BlobServiceClient } from '@azure/storage-blob';


const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING || "your_connection_string_here";
const containerName = 'profile-pictures';
const upload = multer({ dest: 'uploads/' });

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


export const uploadProfilePicture = async (req: SessionRequest, res: Response) => {
    // Retrieve the userId from the session
    const userId = req.session!.getUserId();


    // Construct the update object with inline type assertion
    const update: { profilePicture?: string; } = {};


    const user = await UserData.findOneAndUpdate({ userId: userId }, update);

    if (!user) {
        return res.status(404).send("User not found");
    }

    return res.json(user);
};


const uploadProfilePictureUsingAzure = async (userId: string) => {
    try {
        const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);
        const containerClient = blobServiceClient.getContainerClient(containerName);
        const hashedUserID = hashUserID(userId);
        const blobName = `profile_${hashedUserID}.png`;

        const blockBlobClient = containerClient.getBlockBlobClient(blobName);

        // Upload the file
        await blockBlobClient.uploadFile("picture/");

    } catch (error) {
        console.log(error);
    }
}

function hashUserID(userID: string) {
    return crypto.createHash('sha256').update(userID).digest('hex');
}
