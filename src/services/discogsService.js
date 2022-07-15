const axios = require('axios');

class DiscogsService {
    constructor(options) {
        this.service = axios.create(
            {...options}
        )
        this.service.interceptors.response.use(this.handleSuccess, this.handleError);
        this.baseUrl = 'https://api.discogs.com';
    }
    get(endpoint, callback) {
        console.log( `${this.baseUrl}/${endpoint}` );
        console.log(arguments)
        return this.service.request({
            method: 'GET',
            responseType: 'json',
            url: `${this.baseUrl}/${endpoint}` 
        }).then(response => {
            console.log(response.data)
            return callback ? callback(response.data) : response.data
        })
    }
    post(endpoint, payload, callback) {
        return this.service.request(
            {
                data: payload || {},
                method: 'POST',
                responseType: 'json',
                url: `${this.baseUrl}/${endpoint}` 
            }).then(response => callback ? callback(response.data) : response.data)   
    }

    handleError = (error) => {
		console.log(error);
		return Promise.reject(error);
	};
    
    handleSuccess(response) {
		return response;
	}
}

const discogsService = new DiscogsService({
    headers: {
        'User-Agent':'discogs-graphql/1.0.0'
    }
})

exports.discogsService = discogsService;
