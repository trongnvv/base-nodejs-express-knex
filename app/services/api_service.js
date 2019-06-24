
const coreApi = require('../base/core_api');
const config = require('../../config');

class ApiService {
    constructor() {
        this.core_api = new coreApi();
    }
}

module.exports = ApiService;