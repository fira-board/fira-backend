import ThirdPartyEmailPassword from "supertokens-node/recipe/thirdpartyemailpassword";
import Session from "supertokens-node/recipe/session";
import { TypeInput } from "supertokens-node/types";
import Dashboard from "supertokens-node/recipe/dashboard";
import UserData from "./models/userData";

export function getApiDomain() {
    const apiPort = process.env.PORT || 3001;
    const apiUrl = process.env.API_URL || `http://localhost:${apiPort}`;
    return apiUrl;
}

export function getWebsiteDomain() {
    const websitePort = process.env.WEBSITE_PORT || 3000;
    const websiteUrl = process.env.WEBSITE_URL || `http://localhost:${websitePort}`;
    return websiteUrl;
}

export const SuperTokensConfig: TypeInput = {
    // debug: true,
    supertokens: {
        // this is the location of the SuperTokens core.
        connectionURI: process.env.SUPER_TOKENS_CORE_URL || "https://try.supertokens.io",
    },
    appInfo: {
        appName: process.env.APP_NAME || "Fira",
        apiDomain: getApiDomain(),
        websiteDomain: getWebsiteDomain(),
    },
    // recipeList contains all the modules that you want to
    // use from SuperTokens. See the full list here: https://supertokens.com/docs/guides
    recipeList: [ThirdPartyEmailPassword.init({
        signUpFeature: {
            formFields: [
                { id: "email" }, 
                { id: "password" },
                { id: "name" },
                { id: "profilePicture" },
            ],
        },
        override: {
            apis: (originalImplementation) => {
                return {
                    ...originalImplementation,
                    emailPasswordSignUpPOST: async function (input) {
                        // First we call the original implementation of signUpPOST.
                        let response = await originalImplementation.emailPasswordSignUpPOST!(input);

                        // Post sign up response, we check if it was successful
                        if (response.status === "OK" && response.user.loginMethods.length === 1) {
                           
                            // We have to iterate the formFields to find what we want
                            let name = ""
                            let profilePicture = ""
                            for (let i = 0; i < input.formFields.length; i++) {
                                if (input.formFields[i].id == "name") {
                                    name = input.formFields[i].value
                                }

                                if (input.formFields[i].id == "profilePicture") {
                                    profilePicture = input.formFields[i].value
                                }
                                
                            }

                            // Save the new user
                            new UserData({ userId: response.user.id, allowedTokens: 4000, consumedTokens: 0, name: name, profilePicture: profilePicture }).save();
                        }
                        return response;
                    }
                }
            },
            functions: (originalImplementation) => {
                return {
                    ...originalImplementation,

                    createNewEmailPasswordRecipeUser: async (input: {
                        email: string;
                        password: string;
                        tenantId: string;
                        userContext: any;
                        name: string;
                        profilePicture: string;
                    }) => {
                        // Creating the user using the original implementation
                        const response = await originalImplementation.createNewEmailPasswordRecipeUser(input);
                        
                      if (response.status === "EMAIL_ALREADY_EXISTS_ERROR") {
                            // Handle the error case
                            console.log("Email already exists");
                        }
                        return response;
                    }
                };
            }
        },
        providers: [{
            config: {
                thirdPartyId: "google",
                clients: [{
                    clientId: "1060725074195-kmeum4crr01uirfl2op9kd5acmi9jutn.apps.googleusercontent.com",
                    clientSecret: "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"
                }]
            }
        }, {
            config: {
                thirdPartyId: "github",
                clients: [{
                    clientId: "467101b197249757c71f",
                    clientSecret: "e97051221f4b6426e8fe8d51486396703012f5bd"
                }]
            }
        },],
    }), Session.init(), Dashboard.init()],
};