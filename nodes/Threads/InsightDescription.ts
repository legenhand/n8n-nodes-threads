import type { INodeProperties } from 'n8n-workflow';

export const insightOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['insight'],
			},
		},
		options: [
			{
				name: 'Get Media Insights',
				value: 'getMedia',
				description: 'Get insights for a specific post/media',
				action: 'Get media insights',
			},
			{
				name: 'Get User Insights',
				value: 'getUser',
				description: 'Get insights for an authenticated user account',
				action: 'Get user insights',
			},
		],
		default: 'getMedia',
	},
];

export const insightFields: INodeProperties[] = [
	// ----------------------------------
	//         insight: getMedia
	// ----------------------------------
	{
		displayName: 'Media ID',
		name: 'mediaId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['insight'],
				operation: ['getMedia'],
			},
		},
		description: 'The ID of the post/media to retrieve insights for',
	},
	{
		displayName: 'Metrics',
		name: 'mediaMetrics',
		type: 'multiOptions',
		options: [
			{
				name: 'Likes',
				value: 'likes',
			},
			{
				name: 'Quotes',
				value: 'quotes',
			},
			{
				name: 'Replies',
				value: 'replies',
			},
			{
				name: 'Reposts',
				value: 'reposts',
			},
			{
				name: 'Views',
				value: 'views',
			},
		],
		default: ['views', 'likes', 'replies', 'reposts', 'quotes'],
		required: true,
		displayOptions: {
			show: {
				resource: ['insight'],
				operation: ['getMedia'],
			},
		},
		description: 'The metrics to retrieve for the post',
	},

	// ----------------------------------
	//         insight: getUser
	// ----------------------------------
	{
		displayName: 'User ID',
		name: 'userId',
		type: 'string',
		default: 'me',
		required: true,
		displayOptions: {
			show: {
				resource: ['insight'],
				operation: ['getUser'],
			},
		},
		description: 'The Threads User ID or "me" for authenticated user',
	},
	{
		displayName: 'Metrics',
		name: 'userMetrics',
		type: 'multiOptions',
		options: [
			{
				name: 'Follower Demographics',
				value: 'follower_demographics',
			},
			{
				name: 'Followers Count',
				value: 'followers_count',
			},
			{
				name: 'Likes',
				value: 'likes',
			},
			{
				name: 'Quotes',
				value: 'quotes',
			},
			{
				name: 'Replies',
				value: 'replies',
			},
			{
				name: 'Reposts',
				value: 'reposts',
			},
			{
				name: 'Views',
				value: 'views',
			},
		],
		default: ['views', 'likes', 'replies', 'reposts', 'quotes', 'followers_count'],
		required: true,
		displayOptions: {
			show: {
				resource: ['insight'],
				operation: ['getUser'],
			},
		},
		description: 'The metrics to retrieve for the account',
	},
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['insight'],
				operation: ['getUser'],
			},
		},
		options: [
			{
				displayName: 'Since',
				name: 'since',
				type: 'dateTime',
				default: '',
				description: 'Start of the reporting period',
			},
			{
				displayName: 'Until',
				name: 'until',
				type: 'dateTime',
				default: '',
				description: 'End of the reporting period',
			},
		],
	},
];
