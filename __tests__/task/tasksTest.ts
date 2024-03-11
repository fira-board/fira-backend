import supertest from 'supertest';
import { app } from '../../src/index'; // Import your Express app here
import AuthHelper from '../helpers/authHelper';

const request = supertest(app);
let cookie: string;
let projectId: string;
let taskId: string;
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

describe('Tasks Endpoints', () => {

    describe('GET /projects/:projectId/tasks', () => {
        it('should fetch List of tasks with specified query parameters', async () => {
            const response = await request.get(`/projects/${projectId}/tasks`)
                .set('Accept', 'application/json').set('Cookie', cookie);

            expect(response.statusCode).toBe(200);
            response.body.forEach((task: any) => {
                // Check properties of the task itself
                expect(task).toHaveProperty('_id');
                expect(task).toHaveProperty('title');
                expect(task).toHaveProperty('socialImpact');
                expect(task).toHaveProperty('environmentalImpact');
                expect(task).toHaveProperty('status');
                expect(task).toHaveProperty('userId');
                expect(task).toHaveProperty('estimateDaysToFinish');
                expect(task).toHaveProperty('startDate');
                expect(task).toHaveProperty('endDate');
                expect(task).toHaveProperty('deleted');
                expect(task).toHaveProperty('epic');
                expect(task).toHaveProperty('resource');
                expect(task).toHaveProperty('project', projectId);
            });
        });

        // Add more tests for different combinations of query parameters
    });

    describe('POST /projects/:projectId/tasks', () => {
        it('should create a new task successfully', async () => {
            const response = await request.post(`/projects/${projectId}/tasks`)
                .set('Cookie', cookie)
                .set('Content-Type', 'application/json')
                .send({
                    estimateDaysToFinish: '4',
                    epicId: epicId,
                    resourceId: resourceId,
                    title: "New Test Task",
                })
                .timeout(10000);


            expect(response.statusCode).toBe(201);
            // Check properties of the created task
            expect(response.body).toHaveProperty('title', "New Test Task");
            expect(response.body).toHaveProperty('socialImpact');
            expect(response.body).toHaveProperty('environmentalImpact');
            expect(response.body).toHaveProperty('status', '6f43ca18574e564d919b9c1f');
            expect(response.body).toHaveProperty('userId');
            expect(response.body).toHaveProperty('estimateDaysToFinish');
            expect(response.body).toHaveProperty('startDate');
            expect(response.body).toHaveProperty('endDate');
            expect(response.body).toHaveProperty('deleted', false);
            expect(response.body).toHaveProperty('epic', epicId);
            expect(response.body).toHaveProperty('resource', resourceId);
            expect(response.body).toHaveProperty('project', projectId);
            expect(response.body).toHaveProperty('_id');

            taskId = response.body._id;
        }, 10000);

        // Add more test cases for error scenarios, such as missing required fields,
        // invalid data formats, unauthorized access, etc.
    });

    describe('GET /projects/:projectId/tasks/:taskId', () => {
        it('should fetch task details successfully', async () => {
            // Ensure the project ID is set by the previous test
            expect(projectId).toBeDefined();

            const response = await request.get(`/projects/${projectId}/tasks/${taskId}/`)
                .set('Cookie', cookie);

            expect(response.statusCode).toBe(200);
            expect(response.body).toHaveProperty('_id', taskId);
            expect(response.body).toHaveProperty('title');
            expect(response.body).toHaveProperty('socialImpact');
            expect(response.body).toHaveProperty('environmentalImpact');
            expect(response.body).toHaveProperty('status');
            expect(response.body).toHaveProperty('userId');
            expect(response.body).toHaveProperty('estimateDaysToFinish');
            expect(response.body).toHaveProperty('startDate');
            expect(response.body).toHaveProperty('endDate');
            expect(response.body).toHaveProperty('deleted', false);
            expect(response.body).toHaveProperty('epic');
            expect(response.body.epic).toHaveProperty('_id', epicId);
            expect(response.body).toHaveProperty('resource');
            expect(response.body.resource).toHaveProperty('_id', resourceId);
            expect(response.body).toHaveProperty('project', projectId);
            // Additional assertions for GET response...
        })
    });

    describe('PUT /projects/:projectId/tasks/:taskId', () => {
        it('should update the task successfully', async () => {
            const response = await request.put(`/projects/${projectId}/tasks/${taskId}`)
                .set('Cookie', cookie)
                .send({
                    title: "Edited task name",
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

        describe('DELETE /projects/:projectId/tasks/:taskId', () => {
            it('should delete the task successfully', async () => {
                const response = await request.delete(`/projects/${projectId}/tasks/${taskId}`)
                    .set('Cookie', cookie);

                expect(response.statusCode).toBe(200);
                expect(response.body).toHaveProperty('title', "Edited task name");//failure in update

                const getResponse = await request.get(`/projects/${projectId}/tasks/${taskId}`)
                    .set('Cookie', cookie);

                expect(getResponse.statusCode).toBe(404);
            });
            // Additional test cases for error scenarios...
        })
    });

});
