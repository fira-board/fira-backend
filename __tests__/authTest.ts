import request from 'supertest';

const baseURL = 'http://localhost:3001';

describe('POST /auth/signin', () => {
    it('should sign in successfully with correct credentials', async () => {
        const response = await request(baseURL)
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
            });
        expect(response.status).toBe(200);
        expect(response.body.status).toBe('OK');
        expect(response.body.user).toHaveProperty('id');
        expect(response.body.user.email).toBe('h.123@gmail.com');
    });

    it('should return an error for missing email', async () => {
        const response = await request(baseURL)
            .post('/auth/signin')
            .set('content-type', 'application/json')
            .send({
                formFields: [
                    { id: 'password', value: 'hamza123' }, // Missing email
                ],
            });
        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Are you sending too many / too few formFields?"); 
    });

    it('should return an error for missing password', async () => {
        const response = await request(baseURL)
            .post('/auth/signin')
            .set('content-type', 'application/json')
            .send({
                formFields: [
                    { id: 'email', value: 'h.123@gmail.com' }, // Missing password
                ],
            });
        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Are you sending too many / too few formFields?"); 
    });

    it('should return an error for incorrect email or password', async () => {
        const response = await request(baseURL)
            .post('/auth/signin')
            .set('content-type', 'application/json')
            .send({
                formFields: [
                    { id: 'email', value: 'wrong.email@example.com' },
                    { id: 'password', value: 'wrongPassword' },
                ],
            });
        expect(response.status).toBe(200);
        expect(response.body.status).toBe("WRONG_CREDENTIALS_ERROR");
    });

    // Add more tests as necessary for different error scenarios and edge cases
});
