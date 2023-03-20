const {expect } = require('chai');
const request = require('supertest');
const app = require('../index');

describe('POST /api/register', () => {    
    it('successfully created new user', async () =>{        
        const res = await request(app).post('/api/register').send({
            "username":"gunny",
            "firstname": "Gunny",
            "lastname": "Baby",
            "email": "gunny@hey.com",
            "password": "12345678"
        });
        expect(res.status).to.equal(200);
    });

    it('successfully login', async () =>{        
        const res = await request(app).post('/api/login').send({
            "username":"gunny",
            "password": "12345678"
        });
        expect(res.status).to.equal(200);
    });
})