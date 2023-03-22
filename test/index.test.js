const {expect } = require('chai');
const request = require('supertest');
const app = require('../index');
const sinon = require('sinon');
const bcrypt = require('bcrypt');

const { validationResult } = require('express-validator');
const { MongoClient } = require('mongodb');
const User = require('../login_modules/user');
const UserRepository = require('../login_modules/user_repository');
const { validateRegister, validateLogin } = require('../login_modules/auth_helper');

sinon.stub(UserRepository.prototype, 'createUser');
sinon.stub(UserRepository.prototype, 'findUserByEmail');

describe('Login endpoint', () => {
  before(async () => {
    const uri = process.env.MONGODB_URI;
    client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    db = client.db();    
    userRepo = new UserRepository(db);
    var encryptedPassword = await bcrypt.hash('12345678', 10);
    var result = await db.collection('users').insertOne({ email: 'gunny@hey.com', firstname: 'Gunny', lastname: 'Baby', password: encryptedPassword });

  });

  beforeEach(() => {
    sinon.restore();
  });
    
  after(async () => {
    await app.close();
    await db.collection('users').deleteMany({});    
    await client.close();
  });

  afterEach(async () => {
    
  });

  it('should success with valid and existing user', async () => {
    const response = await request(app)
        .post('/api/login')
        .send({email: "gunny@hey.com", 
        password: '12345678',
      })
        .expect(200);
  
        expect(response.body.token).to.be.a('string');
        expect(response.body.user.email).is.equal('gunny@hey.com');
        expect(response.body.user.firstname).is.equal('Gunny');
        expect(response.body.user.lastname).is.equal('Baby');    
  });

  it('should return error if email is invalid', async () => {
    const response = await request(app)
        .post('/api/login')
        .send({email: 'invalidemail', 
        password: '12345678',
      })
        .expect(422);
  
      expect(response.body.errors).to.have.length(1);
      expect(response.body.errors[0].msg).to.equal('Invalid Email');
  });

  it('should return error if password is too short', async () => {
    const response = await request(app)
        .post('/api/login')
        .send({email: 'gunny@hey.com', 
        password: '12',
      })
        .expect(422);
  
      expect(response.body.errors).to.have.length(1);
      expect(response.body.errors[0].msg).to.equal('Password must be between 8 and 20 characters');
  });

  it('should return error if password is too long', async () => {
    const response = await request(app)
        .post('/api/login')
        .send({email: 'gunny@hey.com', 
        password: '123456781234567812345678123456781234567812345678123456781234567812345678123456781234567812345678123456781234567812345678',
      })
        .expect(422);
  
      expect(response.body.errors).to.have.length(1);
      expect(response.body.errors[0].msg).to.equal('Password must be between 8 and 20 characters');
  });
  
  it('should return error if user is not found', async () => {
    const response = await request(app)
        .post('/api/login')
        .send({email: 'fakeuser@hey.com', 
        password: '12345678',
      })
        .expect(400);
  
      expect(response.body.message).to.equal('Cannot find user');      
  });

  it('should return error if password is invalid', async () => {
    const response = await request(app)
        .post('/api/login')
        .send({email: 'gunny@hey.com', 
        password: '123456789',
      })
        .expect(400);
  
      expect(response.body.message).to.equal('Invalid password');      
  });

});

describe('Registration endpoint', () => {
  before(async () => {
    const uri = process.env.MONGODB_URI;
    client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    db = client.db();    
    userRepo = new UserRepository(db);
  });

    beforeEach(() => {
      sinon.restore();
    });
      
    after(async () => {
      await app.close();
      await client.close();
    });

    afterEach(async () => {
      await db.collection('users').deleteMany({});
    });

    it('should succeed if all inputs are valid', async () => {
      const response = await request(app)
        .post('/api/register')
        .send({
          email: 'gunny@hey.com',
          firstname: 'Gunny',
          lastname: 'Baby',
          password: '12345678',
        })
        .expect(200);
        
        expect(response.body.token).to.be.a('string');
        expect(response.body.user.email).is.equal('gunny@hey.com');
        expect(response.body.user.firstname).is.equal('Gunny');
        expect(response.body.user.lastname).is.equal('Baby');
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
