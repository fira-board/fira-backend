// Middleware to check the request
import { Response, NextFunction } from 'express';
import { SessionRequest } from "supertokens-node/framework/express";
import UserData from "../models/userData";

// Extend the SessionRequest interface to include the 'model' property
declare module 'supertokens-node/framework/express' {
    interface SessionRequest {
        model?: string;
    }
}

// Middleware to check if the user has tokens
const checkUserTokens = async (req: SessionRequest, res: Response, next: NextFunction) => {
    const userId = req.session!.getUserId(); // Assuming you're getting the user ID from the session

    try {
        const user = await UserData.findOne({ userId: userId });

        if (!user) {
            return res.status(404).send('User not found');
        }

        // Add the 'model' property to the request object
        req.model = user.allowedTokens > 0 ? 'GPT-4' : 'GPT-3';

        next();
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
};

// Middleware to subtract tokens from the user
const subtractUserTokens = async (req: SessionRequest, res: Response, next: NextFunction) => {
    const userId = req.session!.getUserId(); // Assuming you're getting the user ID from the session

    try {
        const user = await UserData.findOne({ userId: userId });

        if (!user) {
            return res.status(404).send('User not found');
        }
        const usageHeader = res.getHeader('usage');
        if (!usageHeader)
            next();

        const usage = JSON.parse(usageHeader as string);
        user.consumedTokens += usage.totalTokens;
        user.allowedTokens -= usage.totalTokens;
        await user.save();

        next();
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
};


export { checkUserTokens, subtractUserTokens };