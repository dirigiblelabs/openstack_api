/* globals $ */
/* eslint-env node, dirigible */

var serviceEndpoints = require('openstack/serviceEndpoints');
var httpResponse = require('net/http/response');
var httpClient = require('net/http/client');

exports.authenticate = function(domain, username, password) {
	var url = serviceEndpoints.getIdentityService() + '/v3/auth/tokens';
	var response = httpClient.post(url, {
		'headers': [{
			'name': 'Content-Type',
			'value': 'application/json'
		}],
		'body': JSON.stringify({
			'auth': {
				'identity': {
					'password': {
						'user': {
							'domain': {
									'name': domain
							},
							'name': username,
							'password': password
						}
					},
					'methods': [
						'password'
					]	
				}
			}
		})
	});

	if (response.statusCode !== httpResponse.CREATED) {
		console.error('Error occured during OpenStack authentication: [' + response.statusCode + '] ' + response.statusMessage);
		console.error('Error response: ' + response.data);
	}
	
	return JSON.parse(response.data);
};