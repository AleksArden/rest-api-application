const request = require('supertest');

const app = require('../../server')

describe('POST/ login', () => {

    it('should return status, token and user', async () => {
        const testData = {
            email: 'aleks@i.ua',
            password: '@Aaa123',
        };
        const response = await request(app).post('/users/login').send(testData)
        expect(response.statusCode).toBe(200);

        expect(response.body).toEqual(

            expect.objectContaining({
                token: expect.any(String),

                user: expect.objectContaining({
                    email: expect.any(String),
                    subscription: expect.any(String)
                })

            })
        )
    })

    it('should return email wrong error', async () => {
        const testData = {
            email: 'alex@i.ua',
            password: '@Aaa123',
        }
        const response = await request(app).post('/users/login').send(testData)
        expect(response.statusCode).toBe(401)
    })

    it('should return password wrong error', async () => {
        const testData = {
            email: 'aleks@i.ua',
            password: '%Aaa123',
        }
        const response = await request(app).post('/users/login').send(testData)
        expect(response.statusCode).toBe(401)
    })

    it('should return email required error', async () => {
        const testData = {

            password: '@Aaa123',
        }
        const response = await request(app).post('/users/login').send(testData)
        expect(response.statusCode).toBe(400)
    })

    it('should return password required error', async () => {
        const testData = {
            email: 'aleks@i.ua',

        }
        const response = await request(app).post('/users/login').send(testData)
        expect(response.statusCode).toBe(400)
    })

    it('should return password invalid error', async () => {
        const testData = {
            email: 'aleks@i.ua',
            password: '@aa123',
        }
        const response = await request(app).post('/users/login').send(testData)
        expect(response.statusCode).toBe(400)
    })
    
    it('should return email invalid error', async () => {
        const testData = {
            email: 'aleksi.ua',
            password: '@Aaa123',
        }
        const response = await request(app).post('/users/login').send(testData)
        expect(response.statusCode).toBe(400)
    })
})
