import { Response } from "express";
import { SessionRequest } from "supertokens-node/framework/express";
import * as paypal from '@paypal/checkout-server-sdk';
import UserData from "../models/userData";

// Function to set up the PayPal environment
function environment(): paypal.core.SandboxEnvironment | paypal.core.LiveEnvironment {
    let clientId = process.env.PAYPAL_CLIENT_ID;
    let clientSecret = process.env.PAYPAL_CLIENT_SECRET;

    if (process.env.NODE_ENV === 'production') {
        return new paypal.core.LiveEnvironment(clientId!, clientSecret!);
    } else {
        return new paypal.core.SandboxEnvironment(clientId!, clientSecret!);
    }
}

// Function to create and return a PayPal HTTP client instance
function client(): paypal.core.PayPalHttpClient {
    return new paypal.core.PayPalHttpClient(environment());
}

export const createPurchase = async (req: SessionRequest, res: Response) => {
    const userId = req.session!.getUserId();
    const { orderId, packageType } = req.body;

    // Verify the PayPal transaction
    const paypalClient = client();
    const request = new paypal.orders.OrdersGetRequest(orderId);
    let order;

    order = await paypalClient.execute(request);

    if (order.result.status === 'APPROVED') {
        const captureRequest = new paypal.orders.OrdersCaptureRequest(orderId);
        const capture = await paypalClient.execute(captureRequest);
        if (capture.result.status === 'COMPLETED') {
            // Update the user's subscription status
            await UserData.updateOne(
                { userId },
                { $set: { subscriptionStatus: packageType } }
            );
            res.json({ message: 'Subscription updated successfully', order: capture.result });
        } else {
            res.status(400).send('Unable to complete the PayPal transaction');
        }
    } else {
        res.status(400).send('PayPal transaction not approved');
    }
};

