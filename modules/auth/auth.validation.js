const Joi = require('joi');

const signup = {
    body: Joi.object().required().keys({
        firstName: Joi.string().required().pattern(new RegExp(/[a-z A-Z]{2,20}$/)),
        LastName: Joi.string().required().pattern(new RegExp(/[a-z A-Z]{2,20}$/)),
        email: Joi.string().email().required(),
        password: Joi.string().required().pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,}$/))
    })
}

const confirmEmail = {
    params: Joi.object().required().keys({
        token: Joi.string().required(),
    })
}

const login = {
    body: Joi.object().required().keys({
        email: Joi.string().email().required(),
        password: Joi.string().required().pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,}$/))
    })
}

const sendCode = {
    body: Joi.object().required().keys({
        email: Joi.string().email().required()
    })
}

const forgetPassword = {
    body: Joi.object().required().keys({
        email: Joi.string().email().required(),
        code: Joi.number().required(),
        newPassword: Joi.string().required().pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,}$/))
    })
}


module.exports = {
    signup,
    confirmEmail,
    login,
    sendCode,
    forgetPassword
}