import supertest from 'supertest';
import { app } from '../../src/index'; // Import your Express app here
import AuthHelper from '../helpers/authHelper';

const request = supertest(app);
let cookie: string;
let projectId: string;
let resourceId: string;
let epicId: string;

// Shared sign-in before running tests
beforeAll(async () => {
    const authInstance = AuthHelper.getInstance();
    cookie = await authInstance.signIn();

    // Here, use an existing project ID or create a new project and get its ID
    projectId = '65e2757707e0f37dacb3ff15'; // Replace with dynamic ID if necessary
    resourceId = '65e2757707e0f37dacb3ff17'; // Replace with dynamic ID if necessary
    epicId = '65e2757707e0f37dacb3ff19'; // Replace with dynamic ID if necessary
});

describe('Epics Endpoints', () => {

    describe('GET /projects/:projectId/epics', () => {
        it('should fetch List of epics with specified query parameters', async () => {
            const response = await request.get(`/projects/${projectId}/epics`)
                .set('Accept', 'application/json').set('Cookie', cookie);

            expect(response.statusCode).toBe(200);
            response.body.forEach((epic: any) => {
                // Check properties of the epic itself
                expect(epic).toHaveProperty('_id');
                expect(epic).toHaveProperty('title');
                expect(epic).toHaveProperty('status');
                expect(epic).toHaveProperty('userId');
                expect(epic).toHaveProperty('deleted');
                expect(epic).toHaveProperty('tasks');
                expect(epic).toHaveProperty('resource');
                expect(epic).toHaveProperty('project', projectId);
            });
        });

        // Add more tests for different combinations of query parameters
    });

    describe('POST /projects/:projectId/epics', () => {
        it('should create a new epic successfully', async () => {
            const response = await request.post(`/projects/${projectId}/epics`)
                .set('Cookie', cookie)
                .set('Content-Type', 'application/json')
                .send({
                    resourceId: resourceId,
                    title: "New Test Epic",
                })
                .timeout(10000);


            expect(response.statusCode).toBe(201);
            // Check properties of the created epic
            expect(response.body).toHaveProperty('title', "New Test Epic");
            expect(response.body).toHaveProperty('status', '6f43ca18574e564d919b9c1f');
            expect(response.body).toHaveProperty('userId');
            expect(response.body).toHaveProperty('deleted', false);
            expect(response.body).toHaveProperty('resource', resourceId);
            expect(response.body).toHaveProperty('project', projectId);
            expect(response.body).toHaveProperty('_id');

            epicId = response.body._id;
        }, 10000);

        // Add more test cases for error scenarios, such as missing required fields,
        // invalid data formats, unauthorized access, etc.
    });

    describe('GET /projects/:projectId/epics/:epicId', () => {
        it('should fetch epic details successfully', async () => {
            // Ensure the project ID is set by the previous test
            expect(projectId).toBeDefined();

            const response = await request.get(`/projects/${projectId}/epics/${epicId}/`)
                .set('Cookie', cookie);

            expect(response.statusCode).toBe(200);
            expect(response.body).toHaveProperty('_id');
            expect(response.body).toHaveProperty('title');
            expect(response.body).toHaveProperty('status');
            expect(response.body).toHaveProperty('userId');
            expect(response.body).toHaveProperty('deleted');
            expect(response.body).toHaveProperty('tasks');
            expect(response.body).toHaveProperty('resource');
            expect(response.body).toHaveProperty('project', projectId);
            expect(response.body).toHaveProperty('resource');
            expect(response.body.resource).toHaveProperty('_id', resourceId);
            // Additional assertions for GET response...
        })
    });

    describe('PUT /projects/:projectId/epics/:epicId', () => {
        it('should update the epic successfully', async () => {
            const response = await request.put(`/projects/${projectId}/epics/${epicId}`)
                .set('Cookie', cookie)
                .send({
                    title: "Edited epic name",
                });

            expect(response.statusCode).toBe(200); 
            expect(response.body).toHaveProperty('_id', epicId);
            expect(response.body).toHaveProperty('title', "Edited epic name");
            expect(response.body).toHaveProperty('status');
            expect(response.body).toHaveProperty('userId');
            expect(response.body).toHaveProperty('deleted');
            expect(response.body).toHaveProperty('tasks');
            expect(response.body).toHaveProperty('project', projectId);
            expect(response.body).toHaveProperty('resource', resourceId);
            // Additional test cases for error scenarios...
        });

        describe('DELETE /projects/:projectId/epics/:epicId', () => {
            it('should delete the epic successfully', async () => {
                const response = await request.delete(`/projects/${projectId}/epics/${epicId}`)
                    .set('Cookie', cookie);

                expect(response.statusCode).toBe(200);
                expect(response.body).toHaveProperty('title', "Edited epic name");//failure in update

                const getResponse = await request.get(`/projects/${projectId}/epics/${epicId}`)
                    .set('Cookie', cookie);

                expect(getResponse.statusCode).toBe(404);
            });
            // Additional test cases for error scenarios...
        })
    });

});
