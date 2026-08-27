import type { INodeProperties } from 'n8n-workflow';

export const postOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['post'],
			},
		},
		options: [
			{
				name: 'Create and Publish',
				value: 'create',
				description: 'Create and immediately publish a post (text, image, video, or carousel)',
				action: 'Create and publish a post',
			},
			{
				name: 'Create Media Container',
				value: 'createContainer',
				description: 'Create a media container without publishing',
				action: 'Create a media container',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a post',
				action: 'Delete a post',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a specific post by ID',
				action: 'Get a post',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get posts published by a user',
				action: 'Get many posts',
			},
			{
				name: 'Publish Container',
				value: 'publish',
				description: 'Publish an existing media container',
				action: 'Publish a media container',
			},
		],
		default: 'create',
	},
];

export const postFields: INodeProperties[] = [
	// ----------------------------------
	//         post: create & createContainer
	// ----------------------------------
	{
		displayName: 'User ID',
		name: 'userId',
		type: 'string',
		default: 'me',
		required: true,
		displayOptions: {
			show: {
				resource: ['post'],
				operation: ['create', 'createContainer', 'getAll', 'publish'],
			},
		},
		description: 'The Threads User ID or "me" for authenticated user',
	},
	{
		displayName: 'Media Type',
		name: 'mediaType',
		type: 'options',
		options: [
			{
				name: 'Text',
				value: 'TEXT',
				description: 'Post text content with optional link attachment',
			},
			{
				name: 'Image',
				value: 'IMAGE',
				description: 'Post a single image with caption',
			},
			{
				name: 'Video',
				value: 'VIDEO',
				description: 'Post a single video with caption',
			},
			{
				name: 'Carousel',
				value: 'CAROUSEL',
				description: 'Post multiple images or videos in a carousel',
			},
		],
		default: 'TEXT',
		required: true,
		displayOptions: {
			show: {
				resource: ['post'],
				operation: ['create', 'createContainer'],
			},
		},
		description: 'The type of media to post',
	},
	{
		displayName: 'Text',
		name: 'text',
		type: 'string',
		typeOptions: {
			rows: 4,
		},
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['post'],
				operation: ['create', 'createContainer'],
				mediaType: ['TEXT'],
			},
		},
		description: 'The text content of the post (up to 500 characters)',
	},
	{
		displayName: 'Text',
		name: 'text',
		type: 'string',
		typeOptions: {
			rows: 4,
		},
		default: '',
		displayOptions: {
			show: {
				resource: ['post'],
				operation: ['create', 'createContainer'],
				mediaType: ['IMAGE', 'VIDEO', 'CAROUSEL'],
			},
		},
		description: 'The caption text for the media (up to 500 characters)',
	},
	{
		displayName: 'Image URL',
		name: 'imageUrl',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['post'],
				operation: ['create', 'createContainer'],
				mediaType: ['IMAGE'],
			},
		},
		description: 'The publicly accessible URL of the image (JPEG or PNG)',
	},
	{
		displayName: 'Video URL',
		name: 'videoUrl',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['post'],
				operation: ['create', 'createContainer'],
				mediaType: ['VIDEO'],
			},
		},
		description: 'The publicly accessible URL of the video (MP4 or MOV)',
	},
	{
		displayName: 'Carousel Items',
		name: 'carouselItems',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		default: {},
		required: true,
		displayOptions: {
			show: {
				resource: ['post'],
				operation: ['create', 'createContainer'],
				mediaType: ['CAROUSEL'],
			},
		},
		options: [
			{
				name: 'items',
				displayName: 'Item',
				values: [
					{
						displayName: 'Media Type',
						name: 'mediaType',
						type: 'options',
						options: [
							{
								name: 'Image',
								value: 'IMAGE',
							},
							{
								name: 'Video',
								value: 'VIDEO',
							},
						],
						default: 'IMAGE',
						description: 'The type of this carousel item',
					},
					{
						displayName: 'Media URL',
						name: 'url',
						type: 'string',
						default: '',
						required: true,
						description: 'The publicly accessible URL of the image or video',
					},
					{
						displayName: 'Alt Text',
						name: 'altText',
						type: 'string',
						default: '',
						description: 'Accessibility description for this media item',
					},
				],
			},
		],
		description: 'Images and videos (between 2 and 10 items) to include in the carousel',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['post'],
				operation: ['create', 'createContainer'],
			},
		},
		options: [
			{
				displayName: 'Alt Text',
				name: 'altText',
				type: 'string',
				default: '',
				description: 'Accessibility description for single image or video',
			},
			{
				displayName: 'Link Attachment',
				name: 'linkAttachment',
				type: 'string',
				default: '',
				description: 'URL to attach to a text post (creates a rich link preview)',
			},
			{
				displayName: 'Reply Control',
				name: 'replyControl',
				type: 'options',
				options: [
					{
						name: 'Everyone',
						value: 'everyone',
					},
					{
						name: 'Accounts You Follow',
						value: 'accounts_you_follow',
					},
					{
						name: 'Mentioned Only',
						value: 'mentioned_only',
					},
				],
				default: 'everyone',
				description: 'Determines who can reply to this post',
			},
			{
				displayName: 'Reply To ID',
				name: 'replyToId',
				type: 'string',
				default: '',
				description: 'ID of the post or reply to respond to',
			},
			{
				displayName: 'Topic Tag',
				name: 'topicTag',
				type: 'string',
				default: '',
				description: 'A tag/topic for the post (without the # symbol)',
			},
		],
	},

	// ----------------------------------
	//         post: publish
	// ----------------------------------
	{
		displayName: 'Creation ID',
		name: 'creationId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['post'],
				operation: ['publish'],
			},
		},
		description: 'The ID of the media container to publish',
	},

	// ----------------------------------
	//         post: get & delete
	// ----------------------------------
	{
		displayName: 'Media ID',
		name: 'mediaId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['post'],
				operation: ['get', 'delete'],
			},
		},
		description: 'The ID of the post/media to retrieve or delete',
	},
	{
		displayName: 'Fields Selection',
		name: 'fieldsSelection',
		type: 'options',
		options: [
			{
				name: 'All Fields',
				value: 'all',
				description: 'Fetch all standard post fields',
			},
			{
				name: 'Selected Fields',
				value: 'selected',
				description: 'Choose specific post fields to retrieve',
			},
		],
		default: 'all',
		displayOptions: {
			show: {
				resource: ['post'],
				operation: ['get'],
			},
		},
		description: 'Whether to retrieve all available fields or select specific ones',
	},
	{
		displayName: 'Fields to Return',
		name: 'fields',
		type: 'multiOptions',
		options: [
			{ name: 'Children (Carousel Items)', value: 'children' },
			{ name: 'Has Replies', value: 'has_replies' },
			{ name: 'Hide Status', value: 'hide_status' },
			{ name: 'ID', value: 'id' },
			{ name: 'Is Quote Post', value: 'is_quote_post' },
			{ name: 'Is Reply', value: 'is_reply' },
			{ name: 'Media Product Type', value: 'media_product_type' },
			{ name: 'Media Type', value: 'media_type' },
			{ name: 'Media URL', value: 'media_url' },
			{ name: 'Owner', value: 'owner' },
			{ name: 'Permalink', value: 'permalink' },
			{ name: 'Replied To', value: 'replied_to' },
			{ name: 'Reply Audience', value: 'reply_audience' },
			{ name: 'Root Post', value: 'root_post' },
			{ name: 'Shortcode', value: 'shortcode' },
			{ name: 'Text', value: 'text' },
			{ name: 'Thumbnail URL', value: 'thumbnail_url' },
			{ name: 'Timestamp', value: 'timestamp' },
			{ name: 'Username', value: 'username' },
		],
		default: [
			'id',
			'media_product_type',
			'media_type',
			'media_url',
			'permalink',
			'owner',
			'username',
			'text',
			'timestamp',
			'shortcode',
			'thumbnail_url',
			'children',
			'is_quote_post',
			'has_replies',
			'root_post',
			'replied_to',
			'is_reply',
		],
		displayOptions: {
			show: {
				resource: ['post'],
				operation: ['get'],
				fieldsSelection: ['selected'],
			},
		},
		description: 'Choose which fields to include in the output. All fields are selected by default.',
	},

	// ----------------------------------
	//         post: getAll
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['post'],
				operation: ['getAll'],
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
				resource: ['post'],
				operation: ['getAll'],
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
				resource: ['post'],
				operation: ['getAll'],
			},
		},
		options: [
			{
				displayName: 'After',
				name: 'after',
				type: 'string',
				default: '',
				description: 'Cursor pointing to end of page for forward pagination',
			},
			{
				displayName: 'Before',
				name: 'before',
				type: 'string',
				default: '',
				description: 'Cursor pointing to start of page for backward pagination',
			},
			{
				displayName: 'Fields to Return',
				name: 'fields',
				type: 'multiOptions',
				options: [
					{ name: 'Children (Carousel Items)', value: 'children' },
					{ name: 'Has Replies', value: 'has_replies' },
					{ name: 'Hide Status', value: 'hide_status' },
					{ name: 'ID', value: 'id' },
					{ name: 'Is Quote Post', value: 'is_quote_post' },
					{ name: 'Is Reply', value: 'is_reply' },
					{ name: 'Media Product Type', value: 'media_product_type' },
					{ name: 'Media Type', value: 'media_type' },
					{ name: 'Media URL', value: 'media_url' },
					{ name: 'Owner', value: 'owner' },
					{ name: 'Permalink', value: 'permalink' },
					{ name: 'Shortcode', value: 'shortcode' },
					{ name: 'Text', value: 'text' },
					{ name: 'Thumbnail URL', value: 'thumbnail_url' },
					{ name: 'Timestamp', value: 'timestamp' },
					{ name: 'Username', value: 'username' },
				],
				default: [
					'id',
					'media_product_type',
					'media_type',
					'media_url',
					'permalink',
					'owner',
					'username',
					'text',
					'timestamp',
					'shortcode',
					'thumbnail_url',
					'children',
					'is_quote_post',
				],
				description: 'Choose which fields to include in the output. All fields are selected by default.',
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
