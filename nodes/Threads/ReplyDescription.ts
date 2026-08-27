import type { INodeProperties } from 'n8n-workflow';

export const replyOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['reply'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a reply to a post or comment',
				action: 'Create a reply',
			},
			{
				name: 'Get Conversation',
				value: 'getConversation',
				description: 'Get all replies in a conversation thread',
				action: 'Get conversation thread',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get replies made directly to a specific post',
				action: 'Get replies to a post',
			},
			{
				name: 'Manage (Hide/Unhide)',
				value: 'manage',
				description: 'Hide or unhide a reply on your post',
				action: 'Manage reply visibility',
			},
		],
		default: 'create',
	},
];

export const replyFields: INodeProperties[] = [
	// ----------------------------------
	//         reply: create
	// ----------------------------------
	{
		displayName: 'User ID',
		name: 'userId',
		type: 'string',
		default: 'me',
		required: true,
		displayOptions: {
			show: {
				resource: ['reply'],
				operation: ['create'],
			},
		},
		description: 'The Threads User ID or "me" for authenticated user',
	},
	{
		displayName: 'Reply To ID',
		name: 'replyToId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['reply'],
				operation: ['create'],
			},
		},
		description: 'The ID of the post or reply you want to respond to',
	},
	{
		displayName: 'Media Type',
		name: 'mediaType',
		type: 'options',
		options: [
			{
				name: 'Text',
				value: 'TEXT',
				description: 'Reply with text',
			},
			{
				name: 'Image',
				value: 'IMAGE',
				description: 'Reply with an image',
			},
			{
				name: 'Video',
				value: 'VIDEO',
				description: 'Reply with a video',
			},
		],
		default: 'TEXT',
		required: true,
		displayOptions: {
			show: {
				resource: ['reply'],
				operation: ['create'],
			},
		},
		description: 'The type of reply to post',
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
				resource: ['reply'],
				operation: ['create'],
				mediaType: ['TEXT'],
			},
		},
		description: 'The text content of the reply (up to 500 characters)',
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
				resource: ['reply'],
				operation: ['create'],
				mediaType: ['IMAGE', 'VIDEO'],
			},
		},
		description: 'The caption text for the media reply',
	},
	{
		displayName: 'Image URL',
		name: 'imageUrl',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['reply'],
				operation: ['create'],
				mediaType: ['IMAGE'],
			},
		},
		description: 'The publicly accessible URL of the image',
	},
	{
		displayName: 'Video URL',
		name: 'videoUrl',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['reply'],
				operation: ['create'],
				mediaType: ['VIDEO'],
			},
		},
		description: 'The publicly accessible URL of the video',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['reply'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Alt Text',
				name: 'altText',
				type: 'string',
				default: '',
				description: 'Accessibility description for image or video reply',
			},
			{
				displayName: 'Link Attachment',
				name: 'linkAttachment',
				type: 'string',
				default: '',
				description: 'URL to attach to a text reply',
			},
			{
				displayName: 'Topic Tag',
				name: 'topicTag',
				type: 'string',
				default: '',
				description: 'A tag/topic for the reply',
			},
		],
	},

	// ----------------------------------
	//         reply: getAll & getConversation & manage
	// ----------------------------------
	{
		displayName: 'Media ID',
		name: 'mediaId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['reply'],
				operation: ['getAll', 'getConversation', 'manage'],
			},
		},
		description: 'The ID of the post/reply',
	},
	{
		displayName: 'Hide Reply',
		name: 'hide',
		type: 'boolean',
		default: true,
		required: true,
		displayOptions: {
			show: {
				resource: ['reply'],
				operation: ['manage'],
			},
		},
		description: 'Whether to hide (true) or unhide (false) the reply',
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['reply'],
				operation: ['getAll', 'getConversation'],
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
				resource: ['reply'],
				operation: ['getAll', 'getConversation'],
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
				resource: ['reply'],
				operation: ['getAll', 'getConversation'],
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
				displayName: 'Fields',
				name: 'fields',
				type: 'string',
				default: 'id,text,timestamp,username,permalink,media_product_type,media_type,media_url,shortcode,hide_status,has_replies,root_post,replied_to,is_reply',
				description: 'Comma-separated list of fields to return',
			},
			{
				displayName: 'Reverse Order',
				name: 'reverse',
				type: 'boolean',
				default: false,
				description: 'Whether to return replies in chronological or reverse chronological order',
			},
		],
	},
];
