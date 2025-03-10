const { body } = require('express-validator');

const validateUsername = () => {
    return body('username')
        .notEmpty()
        .withMessage('Username is a required field')
        .isLength({ min: 3 })
        .withMessage('Username must be at least 3 character long')
        .isLength({ max: 20 })
        .withMessage('Username must not exceed 20 characters')
        .matches(/^(?=[a-zA-Z0-9])(?=.*[a-zA-Z0-9]$)[a-zA-Z0-9-_]*$/)
        .withMessage('Username can only contain letters, numbers, hyphens (-), and underscores (_), and must not start or end with a hyphen or underscore');
};

module.exports = {
    validateUsername
};
