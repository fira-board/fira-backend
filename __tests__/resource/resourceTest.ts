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

describe('resource Endpoints', () => {
    describe('GET /resources/', () => {
        it('should fail as unauthrized', async () => {
            await request.get('/resources/')
                .expect(401); // Expecting successful response
        });
    });

    describe('GET /resources/', () => {
        it('should retrieve a list of resources', async () => {
            const response = await request.get('/resources/')
                .set('Cookie', cookie)
                .expect(200); // Expecting successful response

            expect(Array.isArray(response.body)).toBe(true); // Check if the response is an array
            expect(response.body.length).toBeLessThanOrEqual(10); // Check if the array has at least one element
            // Validate each resource object in the array
            response.body.forEach((resource: { _id: any; title: any; userId: any; __v: any }) => {
                expect(resource).toHaveProperty('_id');
                expect(resource).toHaveProperty('title');
                expect(resource).toHaveProperty('userId');
                expect(resource).toHaveProperty('__v');
            });
        });
    });
});