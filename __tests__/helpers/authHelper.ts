import supertest from 'supertest';
import { app } from '../../src/index'; // Import your Express app here

class AuthHelper {
    private static instance: AuthHelper;
    private cookie: string | null = null;

    private constructor() { }

    public static getInstance(): AuthHelper {
        if (!AuthHelper.instance) {
            AuthHelper.instance = new AuthHelper();
        }
        return AuthHelper.instance;
    }

    public async signIn(): Promise<string> {
        if (!this.cookie) {
            const request = supertest(app);
            const response = await request
                .post('/auth/signin')
                .set('sec-ch-ua', '"Microsoft Edge";v="113", "Chromium";v="113", "Not-A.Brand";v="24"')
                .set('fdi-version', '1.16')
                .set('st-auth-mode', 'cookie')
                .set('content-type', 'application/json')
                .set('rid', 'thirdpartyemailpassword')
                .send({
                    formFields: [
                        { id: 'email', value: 'h.123@gmail.com' },
                        { id: 'password', value: 'hamza123' },
                    ],
                })
                .expect(200); // Expecting a successful sign-in

            this.cookie = response.headers['set-cookie'][0].split(';')[0];
        }
        return this.cookie;
    }
}

export default AuthHelper;