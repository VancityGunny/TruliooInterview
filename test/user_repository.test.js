const { expect } = require('chai');
const  {MongoClient} = require('mongodb');
const  User = require('../login_modules/user');
const  UserRepository = require('../login_modules/user_repository');

describe('UserRepository', () => {
  let client, userRepo,db ;

  before(async () => {
    const uri = process.env.MONGODB_URI;
    client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    db = client.db();    
    userRepo = new UserRepository(db);
  });

  after(async () => {
    //await client.close();
    await client.close();
    await db.close();
  });

  afterEach(async () => {
    await db.collection('users').deleteMany({});
  });


  describe('createUser', () => {
    it('should insert a new user into the users collection', async () => {
      const user = new User({email:'gunny@hey.com',firstname:'Gunny',lastname:'Baby',password: '12345678'});
      const result = await userRepo.createUser(user);
      expect(result).to.deep.equal({ id: result.id, email: 'gunny@hey.com', firstname: 'Gunny', lastname: 'Baby' });
      const count = await userRepo.userCollection.countDocuments();
      expect(count).to.equal(1);
    });

    it('should throw an error if a user with the same email already exists', async () => {
      const user1 =  new User({email:'gunny@hey.com',firstname:'Gunny',lastname:'Baby',password: '12345678'});
      await userRepo.createUser(user1);
      const user2 =  new User({email:'gunny@hey.com',firstname:'Gunny',lastname:'Baby',password: '12345678'});
      try {
        await userRepo.createUser(user2);
        expect.fail('Expected createUser to throw an error');
      } catch (err) {
        expect(err.message).to.equal(`User with email gunny@hey.com already exists`);
        const count = await userRepo.userCollection.countDocuments();
        expect(count).to.equal(1);
      }
    });

    it('should throw an error if the user parameter is missing password', async () => {
      const user = new User({email:'gunny@hey.com',firstname:'Gunny',lastname:'Baby'});
      try {
        await userRepo.createUser(user);
        expect.fail('Expected createUser to throw an error');
      } catch (err) {
        expect(err.message).to.equal('Password is required and must be a string.');
        const count = await userRepo.userCollection.countDocuments();
        expect(count).to.equal(0);
      }
    });
    
    it('should throw an error if the password parameter is not a string', async () => {
      const user = new User({email:'gunny@hey.com',firstname:'Gunny',lastname:'Baby',password: 12345678});
      try {
        await userRepo.createUser(user);
        expect.fail('Expected createUser to throw an error');
      } catch (err) {
        expect(err.message).to.equal('Password is required and must be a string.');
        const count = await userRepo.userCollection.countDocuments();
        expect(count).to.equal(0);
      }
    });

    it('should throw an error if the user parameter is missing email', async () => {
      const user = new User({firstname:'Gunny',lastname:'Baby',password: '12345678'});
      try {
        await userRepo.createUser(user);
        expect.fail('Expected createUser to throw an error');
      } catch (err) {
        expect(err.message).to.equal('Email is required and must be a string.');
        const count = await userRepo.userCollection.countDocuments();
        expect(count).to.equal(0);
      }
    });

    it('should throw an error if the email parameter is not a string', async () => {
      const user = new User({email:1234,firstname:'Gunny',lastname:'Baby',password: '12345678'});
      try {
        await userRepo.createUser(user);
        expect.fail('Expected createUser to throw an error');
      } catch (err) {
        expect(err.message).to.equal('Email is required and must be a string.');
        const count = await userRepo.userCollection.countDocuments();
        expect(count).to.equal(0);
      }
    });

    it('should throw an error if the user parameter is missing firstname', async () => {
      const user = new User({email:'gunny@hey.com',lastname:'Baby',password: '12345678'});
      try {
        await userRepo.createUser(user);
        expect.fail('Expected createUser to throw an error');
      } catch (err) {
        expect(err.message).to.equal('First name is required and must be a string.');
        const count = await userRepo.userCollection.countDocuments();
        expect(count).to.equal(0);
      }
    });

    it('should throw an error if the firstname parameter is not a string', async () => {
      const user = new User({email:'gunny@hey.com',firstname:1234,lastname:'Baby',password: '12345678'});
      try {
        await userRepo.createUser(user);
        expect.fail('Expected createUser to throw an error');
      } catch (err) {
        expect(err.message).to.equal('First name is required and must be a string.');
        const count = await userRepo.userCollection.countDocuments();
        expect(count).to.equal(0);
      }
    });
    
    it('should throw an error if the user parameter is missing lastname', async () => {
      const user = new User({email:'gunny@hey.com',firstname:'Gunny',password: '12345678'});
      try {
        await userRepo.createUser(user);
        expect.fail('Expected createUser to throw an error');
      } catch (err) {
        expect(err.message).to.equal('Last name is required and must be a string.');
        const count = await userRepo.userCollection.countDocuments();
        expect(count).to.equal(0);
      }
    });


    it('should throw an error if the lastname parameter is not a string', async () => {
      const user = new User({email:'gunny@hey.com',firstname:'Gunny',lastname:1234,password: '12345678'});
      try {
        await userRepo.createUser(user);
        expect.fail('Expected createUser to throw an error');
      } catch (err) {
        expect(err.message).to.equal('Last name is required and must be a string.');
        const count = await userRepo.userCollection.countDocuments();
        expect(count).to.equal(0);
      }
    });    
    
  });

  describe('findUserByEmail', () => {
    it('should return null if no user with the specified email exists', async () => {
      const result = await userRepo.findUserByEmail('gunny@hey.com');
      expect(result).to.be.null;
    });

    it('should return a User object if a user with the specified email exists', async () => {
      const user =  new User({email:'gunny@hey.com',firstname:'Gunny',lastname:'Baby',password: '12345678'});
      await userRepo.createUser(user);
      const result = await userRepo.findUserByEmail('gunny@hey.com');
      expect(result).to.be.an.instanceOf(User);      
      expect(result.email).to.equal('gunny@hey.com');
      expect(result.firstname).to.equal('Gunny');
      expect(result.lastname).to.equal('Baby');
      expect(result.password).to.equal('12345678');
    });    

    it('should throw an error if the email parameter is not a string', async () => {
      try {
        await userRepo.findUserByEmail(1234);
        expect.fail('Expected findUserByEmail to throw an error');
      } catch (err) {
        expect(err.message).to.equal('Email is required and must be a string.');
      }
    });
    
  });
});
