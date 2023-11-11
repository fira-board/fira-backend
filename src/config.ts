import EmailPassword from "supertokens-node/recipe/emailpassword";
import Session from "supertokens-node/recipe/session";
import { TypeInput } from "supertokens-node/types";
import Dashboard from "supertokens-node/recipe/dashboard";
import UserData from "./models/userData";

export function getApiDomain() {
    const apiPort = process.env.PORT || 3001;
    const apiUrl = process.env.REACT_APP_API_URL || `http://localhost:${apiPort}`;
    return apiUrl;
}

export function getWebsiteDomain() {
    const websitePort = process.env.REACT_APP_WEBSITE_PORT || 3000;
    const websiteUrl = process.env.REACT_APP_WEBSITE_URL || `http://localhost:${websitePort}`;
    return websiteUrl;
}

export const SuperTokensConfig: TypeInput = {
    supertokens: {
        // this is the location of the SuperTokens core.
        connectionURI: "https://try.supertokens.com",
    },
    appInfo: {
        appName: "Fira",
        apiDomain: getApiDomain(),
        websiteDomain: getWebsiteDomain(),
    },
    // recipeList contains all the modules that you want to
    // use from SuperTokens. See the full list here: https://supertokens.com/docs/guides
    recipeList: [EmailPassword.init({
        override: {
            functions: (originalImplementation) => {
                return {
                    ...originalImplementation,

                    signUp: async (input: {
                        email: string;
                        password: string;
                        tenantId: string;
                        userContext: any;
                    }) => {
                        // Creating the user using the original implementation
                        const response = await originalImplementation.signUp(input);

                        if (response.status === "OK") {
                            new UserData({ userId: response.user.id, allowedTokens: 4000, consumedTokens: 0 }).save();

                        } else if (response.status === "EMAIL_ALREADY_EXISTS_ERROR") {
                            // Handle the error case
                            console.log("Email already exists");
                        }
                        return response;
                    }
                };
            }
        }
    }), Session.init(), Dashboard.init()],
};