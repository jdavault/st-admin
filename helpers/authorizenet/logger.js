// var winston = require('winston');
// const config = require('./config').config;
const {LOGGER_OUTPUT = false} = process.env;

const logger = {
    error(obj) {
        if (LOGGER_OUTPUT === true) {
            console.log(obj);
        }
    },
    warn(obj) {
        if (LOGGER_OUTPUT === true) {
            console.log(obj);
        }
    },
    info(obj) {
        if (LOGGER_OUTPUT === true) {
            console.log(obj);
        }
    },
    verbose(obj) {
        if (LOGGER_OUTPUT === true) {
            console.log(obj);
        }
    },
    debug(obj) {
        if (LOGGER_OUTPUT === true) {
            console.log(obj);
        }
    },
    silly(obj) {
        if (LOGGER_OUTPUT === true) {
            console.log(obj);
        }
    },
};

module.exports.logger = logger;
