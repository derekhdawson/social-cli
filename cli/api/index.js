const config = require('../config');
const axios = require('axios');

const SERVER_URL = config.environment === config.environments.DEV ? 'http://localhost:8000/api' : '';




exports.registerUser = (user) => {
    return axios.post(`${SERVER_URL}/users`, { user });
}