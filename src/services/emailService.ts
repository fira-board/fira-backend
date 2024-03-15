import dotenv from "dotenv";
import path from "path";
import { EmailClient } from "@azure/communication-email";


dotenv.config({ path: path.join(__dirname, "../.env") });


const client = new EmailClient(process.env.Azure_COMM_SERVICE_CONNECTION_STRING!);



export const sendInvite = async (from: string, projectName: string, to: string) => {
try {
    // Define your email message (same as in JavaScript example)
    const message = {
        senderAddress: "DoNotReply@firaboard.ai",
        content: {
            subject: "You are invited to firaboard.ai!",
            plainText: "You are invited to join the firaboard.ai project " + projectName + ". Please click the link to join: https://firaboard.ai/",
        },
        recipients: {
            to: [
                { address: to },
            ],
        },
    };

    const poller = await client.beginSend(message);
    const response = await poller.pollUntilDone();

    console.log("email invite", response);

} catch (error) {
    console.log("email invite", error);   
}
}




