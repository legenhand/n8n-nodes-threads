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
		displayName: 'Fields Selection',
		name: 'fieldsSelection',
		type: 'options',
		options: [
			{
				name: 'All Fields',
				value: 'all',
				description: 'Fetch all standard profile fields',
			},
			{
				name: 'Selected Fields',
				value: 'selected',
				description: 'Choose specific profile fields to retrieve',
			},
		],
		default: 'all',
		displayOptions: {
			show: {
				resource: ['user'],
				operation: ['get', 'getMe'],
			},
		},
		description: 'Whether to retrieve all available fields or select specific ones',
	},
	{
		displayName: 'Fields to Return',
		name: 'fields',
		type: 'multiOptions',
		options: [
			{ name: 'Biography', value: 'threads_biography' },
			{ name: 'ID', value: 'id' },
			{ name: 'Is Private Profile', value: 'is_private' },
			{ name: 'Name', value: 'name' },
			{ name: 'Profile Picture URL', value: 'threads_profile_picture_url' },
			{ name: 'Username', value: 'username' },
		],
		default: ['id', 'username', 'name', 'threads_profile_picture_url', 'threads_biography'],
		displayOptions: {
			show: {
				resource: ['user'],
				operation: ['get', 'getMe'],
				fieldsSelection: ['selected'],
			},
		},
		description: 'Choose which fields to include in the output. All fields are selected by default.',
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
		displayName: 'Fields Selection',
		name: 'fieldsSelection',
		type: 'options',
		options: [
			{
				name: 'All Fields',
				value: 'all',
				description: 'Fetch all publishing limit fields',
			},
			{
				name: 'Selected Fields',
				value: 'selected',
				description: 'Choose specific publishing limit fields to retrieve',
			},
		],
		default: 'all',
		displayOptions: {
			show: {
				resource: ['user'],
				operation: ['getPublishingLimit'],
			},
		},
		description: 'Whether to retrieve all available fields or select specific ones',
	},
	{
		displayName: 'Fields to Return',
		name: 'fields',
		type: 'multiOptions',
		options: [
			{ name: 'Config', value: 'config' },
			{ name: 'Quota Duration', value: 'quota_duration' },
			{ name: 'Quota Usage', value: 'quota_usage' },
			{ name: 'Total Quota Usage', value: 'total_quota_usage' },
		],
		default: ['quota_usage', 'config', 'total_quota_usage', 'quota_duration'],
		displayOptions: {
			show: {
				resource: ['user'],
				operation: ['getPublishingLimit'],
				fieldsSelection: ['selected'],
			},
		},
		description: 'Choose which fields to include in the output. All fields are selected by default.',
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
