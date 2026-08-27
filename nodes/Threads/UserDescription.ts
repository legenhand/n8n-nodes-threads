import type { INodeProperties } from 'n8n-workflow';

export const userOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['user'],
			},
		},
		options: [
			{
				name: 'Exchange for Long-Lived Token',
				value: 'exchangeToken',
				description: 'Exchange a short-lived token (1 hour) for a long-lived token (60 days)',
				action: 'Exchange for a long lived token',
			},
			{
				name: 'Get Me',
				value: 'getMe',
				description: 'Get profile information of the authenticated user',
				action: 'Get profile of authenticated user',
			},
			{
				name: 'Get Profile',
				value: 'get',
				description: 'Get profile information for a specific Threads User ID',
				action: 'Get user profile',
			},
			{
				name: 'Get Publishing Limit',
				value: 'getPublishingLimit',
				description: 'Get publishing rate limit and quota usage for authenticated user',
				action: 'Get publishing limit',
			},
			{
				name: 'Refresh Long-Lived Token',
				value: 'refreshToken',
				description: 'Refresh an unexpired long-lived token to reset its 60 days validity',
				action: 'Refresh a long lived token',
			},
		],
		default: 'getMe',
	},
];

export const userFields: INodeProperties[] = [
	// ----------------------------------
	//         user: get
	// ----------------------------------
	{
		displayName: 'User ID',
		name: 'userId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['user'],
				operation: ['get'],
			},
		},
		description: 'The Threads User ID to retrieve profile for',
	},
	{
		displayName: 'Fields',
		name: 'fields',
		type: 'string',
		default: 'id,username,name,threads_profile_picture_url,threads_biography',
		displayOptions: {
			show: {
				resource: ['user'],
				operation: ['get', 'getMe'],
			},
		},
		description: 'Comma-separated list of profile fields to return',
	},
	{
		displayName: 'User ID',
		name: 'userId',
		type: 'string',
		default: 'me',
		required: true,
		displayOptions: {
			show: {
				resource: ['user'],
				operation: ['getPublishingLimit'],
			},
		},
		description: 'The Threads User ID or "me" for authenticated user',
	},
	{
		displayName: 'Fields',
		name: 'fields',
		type: 'string',
		default: 'quota_usage,config,total_quota_usage,quota_duration',
		displayOptions: {
			show: {
				resource: ['user'],
				operation: ['getPublishingLimit'],
			},
		},
		description: 'Comma-separated list of fields to return for publishing limit',
	},

	// ----------------------------------
	//         user: exchangeToken
	// ----------------------------------
	{
		displayName: 'App Secret',
		name: 'clientSecret',
		type: 'string',
		typeOptions: {
			password: true,
		},
		default: '',
		displayOptions: {
			show: {
				resource: ['user'],
				operation: ['exchangeToken'],
			},
		},
		description: 'Your Threads App Secret from Meta App Dashboard. If left empty, will use the secret from OAuth2 credentials.',
	},
	{
		displayName: 'Short-Lived Access Token',
		name: 'accessToken',
		type: 'string',
		typeOptions: {
			password: true,
		},
		default: '',
		displayOptions: {
			show: {
				resource: ['user'],
				operation: ['exchangeToken'],
			},
		},
		description: 'The short-lived access token to exchange. If left empty, uses the token from credentials.',
	},

	// ----------------------------------
	//         user: refreshToken
	// ----------------------------------
	{
		displayName: 'Long-Lived Access Token',
		name: 'accessToken',
		type: 'string',
		typeOptions: {
			password: true,
		},
		default: '',
		displayOptions: {
			show: {
				resource: ['user'],
				operation: ['refreshToken'],
			},
		},
		description: 'The unexpired long-lived access token to refresh. If left empty, uses the token from credentials.',
	},
];
