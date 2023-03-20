const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SECRET_KEY = 'TruliooSecretKey';  // TODO: this should be store in config file or database variable

class User{
    constructor({email, firstname, lastname, password }){
        this.email = email;
        this.firstname = firstname;
        this.lastname = lastname;
        this.password = password;
    }
    async hashPassword() {
        this.password = await bcrypt.hash(this.password, 10);
    }
    
    async comparePassword(password) {
        return await bcrypt.compare(password, this.password);
    }
    
    generateAuthToken() {
        return jwt.sign({ id: this.id }, SECRET_KEY);
    }

    // return DTO, only for consumption
    toJSON(){
        return {
            email :this.email,
            firstname : this.firstname,
            lastname : this.lastname
        }
    }
}
module.exports = User;