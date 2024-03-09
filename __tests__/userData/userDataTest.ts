import supertest from 'supertest';
import { app } from '../../src/index'; // Import your Express app here
import AuthHelper from '../helpers/authHelper';

const request = supertest(app);
let cookie: string;
let projectId: string;

// Shared setup, like signing in and creating/getting a project
beforeAll(async () => {
    const authInstance = AuthHelper.getInstance();
    cookie = await authInstance.signIn();

    // Here, use an existing project ID or create a new project and get its ID
    projectId = '65e2721bfc14b1298142691d'; // Replace with dynamic ID if necessary
});
describe('UserData Endpoints', () => {

    describe('PUT /projects/:id/userRoles', () => {
        it('should update user roles successfully', async () => {
            const response = await request.put(`/projects/${projectId}/userRoles`)
                .set('Cookie', cookie)
                .send({
                    roles: [
                        {
                            email: "h.moghrabi97@gmail.com",
                            role: 2
                        },
                        {
                            email: "Carli33@hotmail.com",
                            role: 1
                        }
                    ]
                });

            expect(response.statusCode).toBe(200); // Or the appropriate success status code
            expect(response.body).toEqual([
                { status: "UPDATED", id: "h.moghrabi97@gmail.com" },
                { status: "EMAIL_SENT", id: "Carli33@hotmail.com" } // Update this based on expected response
            ]);
            // Add more assertions as needed
        });

        it('should fail to responde', async () => {
            const response = await request.put(`/projects/${projectId}/userRoles`)
                .set('Cookie', cookie)
                .send({
                    roles: [
                        {
                            email: "h./moghrabi9@7@gmail.com",
                            role: 2
                        }
                    ]
                });

            expect(response.statusCode).toBe(400); // Or the appropriate success status code
            expect(response.text).toEqual("Invalid email");
        });

        // Additional test cases for error scenarios...
    })


});