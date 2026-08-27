import type { INodeProperties } from 'n8n-workflow';

export const searchOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['search'],
			},
		},
		options: [
			{
				name: 'Keyword Search',
				value: 'keyword',
				description: 'Search public Threads posts by keyword',
				action: 'Search posts by keyword',
			},
		],
		default: 'keyword',
	},
];

export const searchFields: INodeProperties[] = [
	// ----------------------------------
	//         search: keyword
	// ----------------------------------
	{
		displayName: 'Query',
		name: 'query',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['search'],
				operation: ['keyword'],
			},
		},
		description: 'The search query keyword',
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['search'],
				operation: ['keyword'],
			},
		},
		default: false,
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['search'],
				operation: ['keyword'],
				returnAll: [false],
			},
		},
		typeOptions: {
			minValue: 1,
			maxValue: 100,
		},
		default: 50,
		description: 'Max number of results to return',
	},
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['search'],
				operation: ['keyword'],
			},
		},
		options: [
			{
				displayName: 'Fields to Return',
				name: 'fields',
				type: 'multiOptions',
				options: [
					{ name: 'ID', value: 'id' },
					{ name: 'Media Product Type', value: 'media_product_type' },
					{ name: 'Media Type', value: 'media_type' },
					{ name: 'Media URL', value: 'media_url' },
					{ name: 'Permalink', value: 'permalink' },
					{ name: 'Shortcode', value: 'shortcode' },
					{ name: 'Text', value: 'text' },
					{ name: 'Timestamp', value: 'timestamp' },
					{ name: 'Username', value: 'username' },
				],
				default: [
					'id',
					'text',
					'timestamp',
					'username',
					'permalink',
					'media_product_type',
					'media_type',
					'media_url',
					'shortcode',
				],
				description: 'Choose which fields to include in the output. All fields are selected by default.',
			},
		],
	},
];
