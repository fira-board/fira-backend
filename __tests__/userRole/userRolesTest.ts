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
describe('UserRoles Endpoints', () => {

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



    describe('GET /projects/:projectId/userRoles', () => {
        it('should return user roles for the project with corresponding user data', async () => {
            const response = await request.get(`/projects/${projectId}/userRoles`)
                .set('Cookie', cookie)
                .expect(200); // Expecting successful response

            // Check if the response is an array
            expect(Array.isArray(response.body)).toBeTruthy();

            // Check if the response contains userRole and userData objects
            response.body.forEach((item: { userRole: any; userData: any[] }) => {
                expect(item).toHaveProperty('userRole');
                expect(item.userRole).toHaveProperty('_id');
                expect(item.userRole).toHaveProperty('projectId');
                expect(item.userRole).toHaveProperty('userId');
                expect(item.userRole).toHaveProperty('role');
                expect(item.userRole).toHaveProperty('projectIsDeleted');

                expect(item).toHaveProperty('userData');
                expect(Array.isArray(item.userData)).toBeTruthy();
                item.userData.forEach(userData => {
                    expect(userData).toHaveProperty('_id');
                    expect(userData).toHaveProperty('userId');
                    expect(userData).toHaveProperty('name');
                });
            });
        });
    });

    // Add more tests as necessary for different endpoints
});