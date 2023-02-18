import { check, validationResult } from "express-validator";

export const validateRegister = [
  check('name')
    .trim()
    .escape()
    .not()
    .isEmpty()
    .withMessage('User name can not be empty!')
    .bail()
    .isLength({min: 3})
    .withMessage('Minimum 3 characters required!')
    .bail(),
  check('email')
    .trim()
    .normalizeEmail()
    .not()
    .isEmpty()
    .withMessage('Invalid email address!')
    .bail(),
    check('password')
    .not()
    .isEmpty()
    .withMessage('Password Required')
    .bail()
    .isLength({min: 6})
    .withMessage('Minimum 6 characters required!')
    .bail(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
            return res.status(422).json({
                status: true, 
                message: `Data Not Complete`,
                errors: errors.array()
            })
    }

    next();
  },
];

export const validateLogin = [
  check('email')
    .trim()
    .normalizeEmail()
    .not()
    .isEmpty()
    .withMessage('Invalid email address!')
    .bail(),
    check('password')
    .not()
    .isEmpty()
    .withMessage('Password Required')
    .bail()
    .isLength({min: 6})
    .withMessage('Minimum 6 characters required!')
    .bail(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
            return res.status(422).json({
                status: true, 
                message: `Data Not Complete`,
                errors: errors.array()
            })
    }

    next();
  },
];