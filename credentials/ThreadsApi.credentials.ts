import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class ThreadsApi implements ICredentialType {
	name = 'threadsApi';
	displayName = 'Threads API';
	documentationUrl = 'https://developers.facebook.com/documentation/threads';
	icon = 'file:threads.svg' as const;

	properties: INodeProperties[] = [
		{
			displayName: 'Access Token',
			name: 'accessToken',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: true,
			description: 'Threads User Access Token or Long-Lived User Access Token',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials.accessToken}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://graph.threads.net/v1.0',
			url: '/me',
			qs: {
				fields: 'id,username,name',
			},
		},
	};
}
