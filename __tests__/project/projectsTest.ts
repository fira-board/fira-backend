import supertest from 'supertest';
import { app } from '../../src/index'; // Import your Express app here
import AuthHelper from '../helpers/authHelper';

const request = supertest(app);
let cookie: string;


// Shared sign-in before running tests
beforeAll(async () => {
    const authInstance = AuthHelper.getInstance();
    cookie = await authInstance.signIn();
});

describe('Projects Endpoints', () => {
    let projectId: string;

    describe('GET /projects/', () => {
        it('should fetch List of projects with specified query parameters', async () => {
            const response = await request.get('/projects/?fetch=true&includeDeleted=false')
                .set('Accept', 'application/json').set('Cookie', cookie);

            expect(response.statusCode).toBe(200);
            expect(response.body).toBeInstanceOf(Array);
            // You can add more detailed checks for the structure of the response here
        });

        // Add more tests for different combinations of query parameters
    });



    describe('POST /projects/', () => {
        it('should create a new project successfully', async () => {
            const response = await request.post('/projects/')
                .set('Cookie', cookie)
                .set('Content-Type', 'application/json')
                .send({
                    startDate: '2024-05-01',
                    summary: 'my project is an uber like app'
                })
                .timeout(60000);


            expect(response.statusCode).toBe(200); // Or the appropriate success status code
            expect(response.body).toHaveProperty('_id');
            projectId = response.body._id;
            expect(response.body.name).toBeDefined();
            // Add more assertions as needed
        }, 60000);

        // Add more test cases for error scenarios, such as missing required fields,
        // invalid data formats, unauthorized access, etc.
    });

    describe('Get /projects/:projectid', () => {
        it('should fetch project details successfully', async () => {
            // Ensure the project ID is set by the previous test
            expect(projectId).toBeDefined();

            const getResponse = await request.get(`/projects/${projectId}/?fetch=true`)
                .set('Cookie', cookie);

            expect(getResponse.statusCode).toBe(200);
            expect(getResponse.body).toHaveProperty('_id', projectId);
            // Additional assertions for GET response...
        })
    });



    describe('GET /projects/:id/progress', () => {
        it('should fetch project progress successfully', async () => {
            const response = await request.get(`/projects/${projectId}/progress`)
                .set('Cookie', cookie);

            expect(response.statusCode).toBe(200);
            expect(response.body).toHaveProperty('projectId', projectId);
            expect(response.body).toHaveProperty('progress');
            expect(response.body).toHaveProperty('doneTasksCount');
            expect(response.body).toHaveProperty('totalTasksCount');
            // Add more assertions as needed
        })
    });


    describe('PUT /projects/:id', () => {
        it('should update the project successfully', async () => {
            const response = await request.put(`/projects/${projectId}`)
                .set('Cookie', cookie)
                .send({
                    name: "Edited name",
                    description: "Edited description" // Consider using appropriate test data
                });

            expect(response.statusCode).toBe(200); // Or the appropriate success status code
            expect(response.body).toEqual({
                acknowledged: true,
                modifiedCount: 1,
                upsertedId: null,
                upsertedCount: 0,
                matchedCount: 1
            });
            // Additional test cases for error scenarios...
        });

        describe('DELETE /projects/:id', () => {
            it('should delete the project successfully', async () => {
                const response = await request.delete(`/projects/${projectId}`)
                    .set('Cookie', cookie);

                expect(response.statusCode).toBe(200);
                expect(response.body).toHaveProperty('name', "Edited name");//failure in update
                expect(response.body).toHaveProperty('description', "Edited description");//failure in update

                const getResponse = await request.get(`/projects/${projectId}/?fetch=true`)
                    .set('Cookie', cookie);

                expect(getResponse.statusCode).toBe(404);
            });
            // Additional test cases for error scenarios...
        })
    });

});
