const {expect } = require('chai');
const request = require('supertest');
const app = require('../index');

describe('POST /api/register', () => {    
    it('successfully created new user', async () =>{        
        const res = await request(app).post('/api/register').send({});
        expect(res.status).to.equal(200);
    });

    it('successfully login', async () =>{        
        const res = await request(app).post('/api/login').send({});
        expect(res.status).to.equal(200);
    });
})