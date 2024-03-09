import supertest from 'supertest';
import { app } from '../../src/index'; // Import your Express app here
import AuthHelper from '../helpers/authHelper';

const request = supertest(app);
let cookie: string;

// Shared setup, like signing in and creating/getting a project
beforeAll(async () => {
    const authInstance = AuthHelper.getInstance();
    cookie = await authInstance.signIn();
});
describe('UserData Endpoints', () => {



    describe('GET /user/', () => {
        it('should return user details', async () => {
            const response = await request.get('/user/')
                .expect(200); // Check for successful response

            // Validate the response structure
            expect(response.body).toHaveProperty('email');
            expect(Array.isArray(response.body.email)).toBeTruthy();
            expect(response.body.email).toContain('h.123@gmail.com');
            expect(response.body).toHaveProperty('name', 'hamza');
            expect(response.body).toHaveProperty('timeJoineds');
            expect(typeof response.body.timeJoineds).toBe('number');
        });
    });


    describe('PUT /user/', () => {
        it('should update the user\'s name and return the updated user details', async () => {

            const response = await request.put('/user/')
                .send({ name: "TestNewName" })
                .set('Content-Type', 'application/json')
                .expect(200); // Expecting successful response

            // Validate response structure
            expect(response.body).toHaveProperty('_id');
            expect(response.body).toHaveProperty('userId');
            expect(response.body).toHaveProperty('name'); // Check if the name is updated
            expect(response.body).toHaveProperty('allowedTokens');
            expect(response.body).toHaveProperty('consumedTokens');
            expect(response.body).toHaveProperty('__v');
        });

    });

});