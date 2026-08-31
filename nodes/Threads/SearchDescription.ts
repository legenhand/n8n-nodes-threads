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
				name: 'Keyword / Topic Tag Search',
				value: 'keyword',
				description: 'Search public Threads posts by keyword or topic tag',
				action: 'Search posts by keyword or topic tag',
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
		description: 'The search query keyword or topic tag (omit # symbol for tags)',
	},
	{
		displayName: 'Search Mode',
		name: 'searchMode',
		type: 'options',
		options: [
			{
				name: 'Keyword',
				value: 'KEYWORD',
				description: 'Treat query as standard search keywords',
			},
			{
				name: 'Topic Tag',
				value: 'TAG',
				description: 'Treat query as a topic tag (without # symbol)',
			},
		],
		default: 'KEYWORD',
		displayOptions: {
			show: {
				resource: ['search'],
				operation: ['keyword'],
			},
		},
		description: 'Specifies whether to search by keyword or by topic tag',
	},
	{
		displayName: 'Search Type',
		name: 'searchType',
		type: 'options',
		options: [
			{
				name: 'Top (Popular)',
				value: 'TOP',
				description: 'Get the most popular search results',
			},
			{
				name: 'Recent',
				value: 'RECENT',
				description: 'Get the most recent search results',
			},
		],
		default: 'TOP',
		displayOptions: {
			show: {
				resource: ['search'],
				operation: ['keyword'],
			},
		},
		description: 'Specifies the search ordering behavior',
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
				displayName: 'Author Username',
				name: 'authorUsername',
				type: 'string',
				default: '',
				description: 'Filters search results to include only posts created by the specified username (without @)',
			},
			{
				displayName: 'Fields to Return',
				name: 'fields',
				type: 'multiOptions',
				options: [
					{ name: 'Has Replies', value: 'has_replies' },
					{ name: 'ID', value: 'id' },
					{ name: 'Is Quote Post', value: 'is_quote_post' },
					{ name: 'Is Reply', value: 'is_reply' },
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
					'media_type',
					'permalink',
					'timestamp',
					'username',
					'has_replies',
					'is_quote_post',
					'is_reply',
				],
				description: 'Choose which fields to include in the output. All fields are selected by default.',
			},
			{
				displayName: 'Media Type',
				name: 'mediaType',
				type: 'options',
				options: [
					{ name: 'All Media Types', value: 'ALL' },
					{ name: 'Image', value: 'IMAGE' },
					{ name: 'Text', value: 'TEXT' },
					{ name: 'Video', value: 'VIDEO' },
				],
				default: 'ALL',
				description: 'Specifies the type of media to search for',
			},
			{
				displayName: 'Since',
				name: 'since',
				type: 'dateTime',
				default: '',
				description: 'Only return posts created after this timestamp',
			},
			{
				displayName: 'Until',
				name: 'until',
				type: 'dateTime',
				default: '',
				description: 'Only return posts created before this timestamp',
			},
		],
	},
];
