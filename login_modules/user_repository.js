const User = require("../login_modules/user");


class UserRepository {    
    constructor(db) {
      this.db = db;
      this.userCollection = db.collection('users');
    }
    
      async createUser(newUser) {
        const {email, firstname, lastname, password} = newUser;
        if (typeof email !== "string" || !email.trim()) {
          throw new Error("Email is required and must be a string.");
        }
    
        if (typeof firstname !== "string" || !firstname.trim()) {
          throw new Error("First name is required and must be a string.");
        }
    
        if (typeof lastname !== "string" || !lastname.trim()) {
          throw new Error("Last name is required and must be a string.");
        }
    
        if (typeof password !== "string" || !password.trim()) {
          throw new Error("Password is required and must be a string.");
        }
        
        try{
          const result = await this.userCollection.insertOne({ email, firstname, lastname, password });
          return { id: result.insertedId, email, firstname, lastname };        
        } catch(err){
          // there's unique index for email in mongodb so this error is for duplicated email
          if(err.code === 11000){
            throw new Error(`User with email ${email} already exists`);
          }
          throw err;
        }
        
        
        
      }    
    
      async findUserByEmail(email) {
        if (typeof email !== "string" || !email.trim()) {
          throw new Error("Email is required and must be a string.");
        }
        const foundUser = await this.userCollection.findOne({ email });     
        return foundUser ? new User({email:foundUser.email,firstname:foundUser.firstname,lastname:foundUser.lastname,password: foundUser.password}) : null;
      }
    }
    
    module.exports = UserRepository;