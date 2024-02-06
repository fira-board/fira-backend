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
        apiKey: process.env.SUPER_TOKENS_API_KEY || "",
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

                    // Override the third-party sign-in/up function
                    thirdPartySignInUp: async function (input: any) {
                        // First, call the original implementation of signInUpPOST
                        let response = await originalImplementation.thirdPartySignInUp(input);

                        // Check if the sign-in/up was successful
                        if (response.status === "OK") {
                            // Extract user information from the response
                            let userId = response.user.id;
                            let email = response.rawUserInfoFromProvider.fromUserInfoAPI?.email;
                            let name = email.split('@')[0];
                            let profilePicture = response.rawUserInfoFromProvider.fromUserInfoAPI?.picture;

                            // Check if user data already exists
                            const existingUser = await UserData.findOne({ email: email });
                            if (existingUser) {
                                return response;
                            }


                            new UserData({
                                userId: userId,
                                allowedTokens: 4000,
                                consumedTokens: 0,
                                name: name,
                                profilePicture: profilePicture
                            }).save();
                        }
                        return response;
                    },
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
                    clientId: "150502140106-s71a89jop6ludf7v3l9of72kum8dmle9.apps.googleusercontent.com",
                    clientSecret: "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"
                }
                ]
            }
        }, {
            config: {
                thirdPartyId: "github",
                clients: [{
                    clientId: "467101b197249757c71f",
                    clientSecret: "40ca11fc5a0436a3cf7b434b99f3638b5db9bcc4"
                }]
            }
        },],
    }), Session.init(), Dashboard.init()],
};