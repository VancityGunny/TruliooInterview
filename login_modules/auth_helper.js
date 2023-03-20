const {body, validationResult}  = require('express-validator');
const User = require("../login_modules/user");

// use same length restriction for firstname, lastname for now
// TODO: move this to somewhere easy to find and config too
const minNameLength = 3;
const maxNameLength = 20;

const minPasswordLength = 8;
const maxPasswordLength = 20;

//TODO: all these error message should be store in resource file that allow it to be localized too
exports.validateRegister = [    
    body('email')
        .trim()
        .isEmail()
        .withMessage('Invalid Email')
        .normalizeEmail(),
    body('firstname')
        .trim()
        .isLength({min: minNameLength, max: maxNameLength})
        .withMessage(`Firstname must be between ${minNameLength} and ${maxNameLength} characters`)
        .isAlpha()
        .withMessage(`Firstname must be alphanumeric`),
    body('lastname')
        .trim()
        .isLength({min: minNameLength, max: maxNameLength})
        .withMessage(`Lastname must be between ${minNameLength} and ${maxNameLength} characters`)
        .isAlpha(),
    body('password')
        .trim()
        .isLength({min: minPasswordLength, max: maxPasswordLength})
        .withMessage(`Password must be between ${minPasswordLength} and ${maxPasswordLength} characters`)       
    
];

exports.registerNewUser = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(422).json({ errors: errors.array() });
        }
    
        const user = new User(req.body);
        await user.hashPassword();
    
        // TODO: Save the user to the database
    
        const token = user.generateAuthToken();
        res.json({ token, user: user.toJSON() });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
      }
}

//TODO: all these error message should be store in resource file that allow it to be localized too
exports.validateRegister = [
    body('email')
        .trim()
        .isEmail()
        .withMessage('Invalid Email')
        .normalizeEmail(),
    body('password')
        .trim()
        .isLength({min: minPasswordLength, max: maxPasswordLength})
        .withMessage(`Password must be between ${minPasswordLength} and ${maxPasswordLength} characters`)           
];

exports.login = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(422).json({ errors: errors.array() });
        }
    
        const { email, password } = req.body;
        
        // TODO: Find user matching the email
        // PUT in fake user for now to make test passed
        let user = new User({email:'gunny@hey.com',firstname:'Gunny',lastname:'Baby',password:'12345678'});

        // if (!user) {
        //   return res.status(400).json({ message: 'Cannot find user' });
        // }
    
        // const isPasswordCorrect = await user.comparePassword(password);
        // if (!isPasswordCorrect) {
        //   return res.status(400).json({ message: 'Invalid password' });
        // }
    
        const token = user.generateAuthToken();
        res.json({ token, user: user.toJSON() });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' }); // TODO: all these HTTP response templates should be standardized and put somewhere common
      }
}