const {expect } = require('chai');
const request = require('supertest');
const app = require('../index');
const sinon = require('sinon');

const { validationResult } = require('express-validator');
const { MongoClient } = require('mongodb');
const User = require('../login_modules/user');
const UserRepository = require('../login_modules/user_repository');
const { validateRegister, validateLogin } = require('../login_modules/auth_helper');


// Mock database connection
sinon.stub(MongoClient.prototype, 'connect');
const uri = process.env.MONGODB_URI;
  
const mockClient = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const mockDb = mockClient.db();

sinon.stub(UserRepository.prototype, 'createUser');
sinon.stub(UserRepository.prototype, 'findUserByEmail');


describe('Registration endpoint', () => {
    beforeEach(() => {
      sinon.restore();
    });
  
    it('should return error if email is invalid', async () => {
      const response = await request(app)
        .post('/api/register')
        .send({
          email: 'invalidemail',
          firstname: 'Gunny',
          lastname: 'Baby',
          password: '12345678',
        })
        .expect(422);
  
      expect(response.body.errors).to.have.length(1);
      expect(response.body.errors[0].msg).to.equal('Invalid Email');
    });
  
    it('should return error if firstname is not alphanumeric', async () => {
      const response = await request(app)
        .post('/api/register')
        .send({
          email: 'gunny@hey.com',
          firstname: 'Gunny123',
          lastname: 'Baby',
          password: '12345678',
        })
        .expect(422);
  
      expect(response.body.errors).to.have.length(1);
      expect(response.body.errors[0].msg).to.equal('Firstname must be alphanumeric');
    });
  
    it('should return error if firstname is too short', async () => {
      const response = await request(app)
        .post('/api/register')
        .send({
          email: 'gunny@hey.com',
          firstname: 'Gu',
          lastname: 'Baby',
          password: '12345678',
        })
        .expect(422);
  
      expect(response.body.errors).to.have.length(1);
      expect(response.body.errors[0].msg).to.equal('Firstname must be between 3 and 20 characters');
    });
  
    it('should return error if firstname is too long', async () => {
      const response = await request(app)
        .post('/api/register')
        .send({
          email: 'gunny@hey.com',
          firstname: 'GunnyGunnyGunnyGunnyGunnyGunny',
          lastname: 'Baby',
          password: '12345678',
        })
        .expect(422);
  
      expect(response.body.errors).to.have.length(1);
      expect(response.body.errors[0].msg).to.equal('Firstname must be between 3 and 20 characters');
    });
  
    it('should return error if lastname is too short', async () => {
      const response = await request(app)
        .post('/api/register')
        .send({
          email: 'gunny@hey.com',
          firstname: 'Gunny',
          lastname: 'Ba',
          password: '12345678',
        })
        .expect(422);
  
      expect(response.body.errors).to.have.length(1);
      expect(response.body.errors[0].msg).to.equal('Lastname must be between 3 and 20 characters');
    });
  
    it('should return error if lastname is too long', async () => {
        const response = await request(app)
          .post('/api/register')
          .send({
            email: 'gunny@hey.com',
            firstname: 'Gunny',
            lastname: 'BabyBabyBabyBabyBabyBabyBabyBabyBabyBabyBabyBabyBabyBabyBabyBabyBabyBabyBabyBabyBabyBabyBabyBabyBabyBabyBabyBaby',
            password: '12345678',
          })
          .expect(422);
    
        expect(response.body.errors).to.have.length(1);
        expect(response.body.errors[0].msg).to.equal('Lastname must be between 3 and 20 characters');
      });
    });


// describe('POST /api/register', () => {    
//     it('successfully created new user', async () =>{        
//         const res = await request(app).post('/api/register').send({
//             "username":"gunny",
//             "firstname": "Gunny",
//             "lastname": "Baby",
//             "email": "gunny@hey.com",
//             "password": "12345678"
//         });
//         expect(res.status).to.equal(200);
//     });

//     it('successfully login', async () =>{        
//         const res = await request(app).post('/api/login').send({
//             "email": "gunny@hey.com",
//             "password": "12345678"
//         });
//         expect(res.status).to.equal(200);
//     });
// })

