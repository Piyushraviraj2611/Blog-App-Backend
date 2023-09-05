const { check, validationResult } = require('express-validator');

exports.postValidator = [
    check('title') // check the title field
        .trim() // trim any whitespace
        .not()
        .isEmpty() // make sure it's not empty
        .withMessage('Title is required'), // return this message if it is empty

    check('content') // check the content field
        .trim() // trim any whitespace
        .not()
        .isEmpty() // make sure it's not empty
        .withMessage('Content is required') // return this message if it is empty
        .isLength({ min: 10 }) // make sure it's at least 10 characters long
        .withMessage('Content is too short'),

    check('meta') // check the meta field
        .trim() // trim any whitespace
        .not()
        .isEmpty() // make sure it's not empty
        .withMessage('Meta description is required'), // return this message if it is empty

    check('slug') // check the slug field
        .trim() // trim any whitespace
        .not()
        .isEmpty() // make sure it's not empty
        .withMessage('Slug is required') // return this message if it is empty
        .isLength({ min: 5 }) // make sure it's at least 5 characters long
        .withMessage('Slug must be at least 5 characters long')
        .matches(/^[a-zA-Z0-9-_]+$/) // make sure it only contains letters, numbers, dashes, and underscores
        .withMessage('Slug can only contain letters, numbers, dashes and underscores'),

    check('tags') // check the tags field
        .isArray() // make sure it's an array
        .withMessage('Tags must be an array of strings')
        .custom((value) => { // make sure each item in the array is a string
            return value.every((item) => typeof item === 'string');
        })
       .withMessage('Tags must be an array of strings') // return this message if it's not

];

exports.validate = (req, res, next) => {
    const errors = validationResult(req).array();

    if (errors.length > 0) {
        return res.status(422).json({ error: errors[0].msg });
    }

    next();
}