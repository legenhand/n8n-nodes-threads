import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	JsonObject,
} from 'n8n-workflow';
import { NodeConnectionTypes, NodeOperationError, NodeApiError } from 'n8n-workflow';

import {
	postFields,
	postOperations,
} from './PostDescription';
import {
	userFields,
	userOperations,
} from './UserDescription';
import {
	replyFields,
	replyOperations,
} from './ReplyDescription';
import {
	insightFields,
	insightOperations,
} from './InsightDescription';
import {
	searchFields,
	searchOperations,
} from './SearchDescription';
import {
	formatFields,
	publishContainer,
	threadsApiRequest,
	threadsApiRequestAllItems,
	waitForContainerReady,
} from './GenericFunctions';

export class Threads implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Threads',
		name: 'threads',
		icon: { light: 'file:threads.svg', dark: 'file:threads.dark.svg' },
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Consume official Meta Threads API',
		defaults: {
			name: 'Threads',
		},
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		usableAsTool: true,
		credentials: [
			{
				name: 'threadsOAuth2Api',
				required: true,
				displayOptions: {
					show: {
						authentication: ['oAuth2'],
					},
				},
			},
			{
				name: 'threadsApi',
				required: true,
				displayOptions: {
					show: {
						authentication: ['accessToken'],
					},
				},
			},
		],
		properties: [
			{
				displayName: 'Authentication',
				name: 'authentication',
				type: 'options',
				options: [
					{
						name: 'OAuth2',
						value: 'oAuth2',
					},
					{
						name: 'Access Token',
						value: 'accessToken',
					},
				],
				default: 'oAuth2',
			},
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Insight',
						value: 'insight',
					},
					{
						name: 'Post',
						value: 'post',
					},
					{
						name: 'Reply',
						value: 'reply',
					},
					{
						name: 'Search',
						value: 'search',
					},
					{
						name: 'User',
						value: 'user',
					},
				],
				default: 'post',
			},
			...postOperations,
			...postFields,
			...userOperations,
			...userFields,
			...replyOperations,
			...replyFields,
			...insightOperations,
			...insightFields,
			...searchOperations,
			...searchFields,
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const length = items.length;

		for (let i = 0; i < length; i++) {
			try {
				const resource = this.getNodeParameter('resource', i) as string;
				const operation = this.getNodeParameter('operation', i) as string;

				let responseData: IDataObject | IDataObject[] = {};

				// =================================================================
				//                               POST
				// =================================================================
				if (resource === 'post') {
					if (operation === 'create' || operation === 'createContainer') {
						const userId = this.getNodeParameter('userId', i, 'me') as string;
						const mediaType = this.getNodeParameter('mediaType', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IDataObject;

						let containerId = '';

						if (mediaType === 'TEXT') {
							const text = this.getNodeParameter('text', i) as string;
							const body: IDataObject = {
								media_type: 'TEXT',
								text,
							};

							if (additionalFields.linkAttachment) {
								body.link_attachment = additionalFields.linkAttachment;
							}
							if (additionalFields.replyControl) {
								body.reply_control = additionalFields.replyControl;
							}
							if (additionalFields.replyToId) {
								body.reply_to_id = additionalFields.replyToId;
							}
							if (additionalFields.topicTag) {
								body.topic_tag = additionalFields.topicTag;
							}

							const containerResponse = await threadsApiRequest.call(
								this,
								'POST',
								`/${userId}/threads`,
								{},
								body,
							);
							containerId = containerResponse.id as string;
						} else if (mediaType === 'IMAGE') {
							const imageUrl = this.getNodeParameter('imageUrl', i) as string;
							const text = this.getNodeParameter('text', i, '') as string;
							const body: IDataObject = {
								media_type: 'IMAGE',
								image_url: imageUrl,
							};

							if (text) {
								body.text = text;
							}
							if (additionalFields.altText) {
								body.alt_text = additionalFields.altText;
							}
							if (additionalFields.replyControl) {
								body.reply_control = additionalFields.replyControl;
							}
							if (additionalFields.replyToId) {
								body.reply_to_id = additionalFields.replyToId;
							}
							if (additionalFields.topicTag) {
								body.topic_tag = additionalFields.topicTag;
							}

							const containerResponse = await threadsApiRequest.call(
								this,
								'POST',
								`/${userId}/threads`,
								{},
								body,
							);
							containerId = containerResponse.id as string;
						} else if (mediaType === 'VIDEO') {
							const videoUrl = this.getNodeParameter('videoUrl', i) as string;
							const text = this.getNodeParameter('text', i, '') as string;
							const body: IDataObject = {
								media_type: 'VIDEO',
								video_url: videoUrl,
							};

							if (text) {
								body.text = text;
							}
							if (additionalFields.altText) {
								body.alt_text = additionalFields.altText;
							}
							if (additionalFields.replyControl) {
								body.reply_control = additionalFields.replyControl;
							}
							if (additionalFields.replyToId) {
								body.reply_to_id = additionalFields.replyToId;
							}
							if (additionalFields.topicTag) {
								body.topic_tag = additionalFields.topicTag;
							}

							const containerResponse = await threadsApiRequest.call(
								this,
								'POST',
								`/${userId}/threads`,
								{},
								body,
							);
							containerId = containerResponse.id as string;

							// If we are publishing immediately, wait for video processing
							if (operation === 'create') {
								await waitForContainerReady.call(this, containerId);
							}
						} else if (mediaType === 'CAROUSEL') {
							const carouselData = this.getNodeParameter('carouselItems', i) as {
								items?: Array<{
									mediaType: string;
									url: string;
									altText?: string;
								}>;
							};
							const itemsList = carouselData.items || [];

							if (itemsList.length < 2 || itemsList.length > 10) {
								throw new NodeOperationError(
									this.getNode(),
									'Carousel posts require between 2 and 10 items.',
									{ itemIndex: i },
								);
							}

							const childContainerIds: string[] = [];

							for (const carouselItem of itemsList) {
								const childBody: IDataObject = {
									is_carousel_item: 'true',
									media_type: carouselItem.mediaType,
								};

								if (carouselItem.mediaType === 'IMAGE') {
									childBody.image_url = carouselItem.url;
								} else if (carouselItem.mediaType === 'VIDEO') {
									childBody.video_url = carouselItem.url;
								}

								if (carouselItem.altText) {
									childBody.alt_text = carouselItem.altText;
								}

								const childResponse = await threadsApiRequest.call(
									this,
									'POST',
									`/${userId}/threads`,
									{},
									childBody,
								);
								const childId = childResponse.id as string;

								if (carouselItem.mediaType === 'VIDEO') {
									await waitForContainerReady.call(this, childId);
								}

								childContainerIds.push(childId);
							}

							const text = this.getNodeParameter('text', i, '') as string;
							const parentBody: IDataObject = {
								media_type: 'CAROUSEL',
								children: childContainerIds.join(','),
							};

							if (text) {
								parentBody.text = text;
							}
							if (additionalFields.replyControl) {
								parentBody.reply_control = additionalFields.replyControl;
							}
							if (additionalFields.replyToId) {
								parentBody.reply_to_id = additionalFields.replyToId;
							}
							if (additionalFields.topicTag) {
								parentBody.topic_tag = additionalFields.topicTag;
							}

							const parentResponse = await threadsApiRequest.call(
								this,
								'POST',
								`/${userId}/threads`,
								{},
								parentBody,
							);
							containerId = parentResponse.id as string;
						}

						if (operation === 'createContainer') {
							responseData = {
								id: containerId,
								creation_id: containerId,
								media_type: mediaType,
								status: 'CONTAINER_CREATED',
							};
						} else {
							// Publish container immediately
							const publishResponse = await publishContainer.call(
								this,
								userId,
								containerId,
							);
							responseData = {
								id: publishResponse.id,
								creation_id: containerId,
								...publishResponse,
							};
						}
					} else if (operation === 'publish') {
						const userId = this.getNodeParameter('userId', i, 'me') as string;
						const creationId = this.getNodeParameter('creationId', i) as string;
						responseData = await publishContainer.call(this, userId, creationId);
					} else if (operation === 'get') {
						const mediaId = this.getNodeParameter('mediaId', i) as string;
						const fields = formatFields(this.getNodeParameter('fields', i) as string | string[]);
						responseData = await threadsApiRequest.call(
							this,
							'GET',
							`/${mediaId}`,
							{},
							{ fields },
						);
					} else if (operation === 'delete') {
						const mediaId = this.getNodeParameter('mediaId', i) as string;
						responseData = await threadsApiRequest.call(
							this,
							'DELETE',
							`/${mediaId}`,
						);
					} else if (operation === 'getAll') {
						const userId = this.getNodeParameter('userId', i, 'me') as string;
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						const options = this.getNodeParameter('options', i, {}) as IDataObject;

						const qs: IDataObject = {};
						if (options.fields) {
							qs.fields = formatFields(options.fields as string | string[]);
						}
						if (options.since) {
							qs.since = Math.floor(new Date(options.since as string).getTime() / 1000);
						}
						if (options.until) {
							qs.until = Math.floor(new Date(options.until as string).getTime() / 1000);
						}
						if (options.before) {
							qs.before = options.before;
						}
						if (options.after) {
							qs.after = options.after;
						}

						if (returnAll) {
							responseData = await threadsApiRequestAllItems.call(
								this,
								`/${userId}/threads`,
								qs,
								0,
							);
						} else {
							const limit = this.getNodeParameter('limit', i, 20) as number;
							responseData = await threadsApiRequestAllItems.call(
								this,
								`/${userId}/threads`,
								qs,
								limit,
							);
						}
					}
				}

				// =================================================================
				//                               USER
				// =================================================================
				else if (resource === 'user') {
					if (operation === 'getMe') {
						const fields = formatFields(this.getNodeParameter('fields', i) as string | string[]);
						responseData = await threadsApiRequest.call(
							this,
							'GET',
							'/me',
							{},
							{ fields },
						);
					} else if (operation === 'get') {
						const userId = this.getNodeParameter('userId', i) as string;
						const fields = formatFields(this.getNodeParameter('fields', i) as string | string[]);
						responseData = await threadsApiRequest.call(
							this,
							'GET',
							`/${userId}`,
							{},
							{ fields },
						);
					} else if (operation === 'getPublishingLimit') {
						const userId = this.getNodeParameter('userId', i, 'me') as string;
						const fields = formatFields(this.getNodeParameter('fields', i) as string | string[]);
						responseData = await threadsApiRequest.call(
							this,
							'GET',
							`/${userId}/threads_publishing_limit`,
							{},
							{ fields },
						);
					} else if (operation === 'exchangeToken') {
						let clientSecret = this.getNodeParameter('clientSecret', i, '') as string;
						let accessToken = this.getNodeParameter('accessToken', i, '') as string;

						const authenticationMethod = this.getNodeParameter(
							'authentication',
							i,
							'oAuth2',
						) as 'oAuth2' | 'accessToken';

						if (!clientSecret && authenticationMethod === 'oAuth2') {
							const credentials = await this.getCredentials('threadsOAuth2Api');
							clientSecret = (credentials.clientSecret as string) || '';
						}

						if (!accessToken) {
							if (authenticationMethod === 'oAuth2') {
								const credentials = await this.getCredentials('threadsOAuth2Api');
								const oauthTokenData = (credentials.oauthTokenData || {}) as IDataObject;
								accessToken =
									(oauthTokenData.access_token as string) ||
									(credentials.accessToken as string) ||
									'';
							} else {
								const credentials = await this.getCredentials('threadsApi');
								accessToken = (credentials.accessToken as string) || '';
							}
						}

						if (!clientSecret) {
							throw new NodeOperationError(
								this.getNode(),
								'App Secret is required to exchange for a long-lived token.',
								{ itemIndex: i },
							);
						}

						if (!accessToken) {
							throw new NodeOperationError(
								this.getNode(),
								'Access Token is required to exchange for a long-lived token.',
								{ itemIndex: i },
							);
						}

						responseData = await threadsApiRequest.call(
							this,
							'GET',
							'/access_token',
							{},
							{
								grant_type: 'th_exchange_token',
								client_secret: clientSecret,
								access_token: accessToken,
							},
						);
					} else if (operation === 'refreshToken') {
						let accessToken = this.getNodeParameter('accessToken', i, '') as string;

						if (!accessToken) {
							const authenticationMethod = this.getNodeParameter(
								'authentication',
								i,
								'oAuth2',
							) as 'oAuth2' | 'accessToken';

							if (authenticationMethod === 'oAuth2') {
								const credentials = await this.getCredentials('threadsOAuth2Api');
								const oauthTokenData = (credentials.oauthTokenData || {}) as IDataObject;
								accessToken =
									(oauthTokenData.access_token as string) ||
									(credentials.accessToken as string) ||
									'';
							} else {
								const credentials = await this.getCredentials('threadsApi');
								accessToken = (credentials.accessToken as string) || '';
							}
						}

						if (!accessToken) {
							throw new NodeOperationError(
								this.getNode(),
								'Access Token is required to refresh a long-lived token.',
								{ itemIndex: i },
							);
						}

						responseData = await threadsApiRequest.call(
							this,
							'GET',
							'/refresh_access_token',
							{},
							{
								grant_type: 'th_refresh_token',
								access_token: accessToken,
							},
						);
					}
				}

				// =================================================================
				//                               REPLY
				// =================================================================
				else if (resource === 'reply') {
					if (operation === 'create') {
						const userId = this.getNodeParameter('userId', i, 'me') as string;
						const replyToId = this.getNodeParameter('replyToId', i) as string;
						const mediaType = this.getNodeParameter('mediaType', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IDataObject;

						let containerId = '';

						if (mediaType === 'TEXT') {
							const text = this.getNodeParameter('text', i) as string;
							const body: IDataObject = {
								media_type: 'TEXT',
								text,
								reply_to_id: replyToId,
							};

							if (additionalFields.linkAttachment) {
								body.link_attachment = additionalFields.linkAttachment;
							}
							if (additionalFields.topicTag) {
								body.topic_tag = additionalFields.topicTag;
							}

							const containerResponse = await threadsApiRequest.call(
								this,
								'POST',
								`/${userId}/threads`,
								{},
								body,
							);
							containerId = containerResponse.id as string;
						} else if (mediaType === 'IMAGE') {
							const imageUrl = this.getNodeParameter('imageUrl', i) as string;
							const text = this.getNodeParameter('text', i, '') as string;
							const body: IDataObject = {
								media_type: 'IMAGE',
								image_url: imageUrl,
								reply_to_id: replyToId,
							};

							if (text) {
								body.text = text;
							}
							if (additionalFields.altText) {
								body.alt_text = additionalFields.altText;
							}
							if (additionalFields.topicTag) {
								body.topic_tag = additionalFields.topicTag;
							}

							const containerResponse = await threadsApiRequest.call(
								this,
								'POST',
								`/${userId}/threads`,
								{},
								body,
							);
							containerId = containerResponse.id as string;
						} else if (mediaType === 'VIDEO') {
							const videoUrl = this.getNodeParameter('videoUrl', i) as string;
							const text = this.getNodeParameter('text', i, '') as string;
							const body: IDataObject = {
								media_type: 'VIDEO',
								video_url: videoUrl,
								reply_to_id: replyToId,
							};

							if (text) {
								body.text = text;
							}
							if (additionalFields.altText) {
								body.alt_text = additionalFields.altText;
							}
							if (additionalFields.topicTag) {
								body.topic_tag = additionalFields.topicTag;
							}

							const containerResponse = await threadsApiRequest.call(
								this,
								'POST',
								`/${userId}/threads`,
								{},
								body,
							);
							containerId = containerResponse.id as string;

							await waitForContainerReady.call(this, containerId);
						}

						const publishResponse = await publishContainer.call(
							this,
							userId,
							containerId,
						);
						responseData = {
							id: publishResponse.id,
							creation_id: containerId,
							reply_to_id: replyToId,
							...publishResponse,
						};
					} else if (operation === 'getAll') {
						const mediaId = this.getNodeParameter('mediaId', i) as string;
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						const options = this.getNodeParameter('options', i, {}) as IDataObject;

						const qs: IDataObject = {};
						if (options.fields) {
							qs.fields = formatFields(options.fields as string | string[]);
						}
						if (options.reverse !== undefined) {
							qs.reverse = options.reverse;
						}
						if (options.before) {
							qs.before = options.before;
						}
						if (options.after) {
							qs.after = options.after;
						}

						if (returnAll) {
							responseData = await threadsApiRequestAllItems.call(
								this,
								`/${mediaId}/replies`,
								qs,
								0,
							);
						} else {
							const limit = this.getNodeParameter('limit', i, 20) as number;
							responseData = await threadsApiRequestAllItems.call(
								this,
								`/${mediaId}/replies`,
								qs,
								limit,
							);
						}
					} else if (operation === 'getConversation') {
						const mediaId = this.getNodeParameter('mediaId', i) as string;
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						const options = this.getNodeParameter('options', i, {}) as IDataObject;

						const qs: IDataObject = {};
						if (options.fields) {
							qs.fields = formatFields(options.fields as string | string[]);
						}
						if (options.reverse !== undefined) {
							qs.reverse = options.reverse;
						}
						if (options.before) {
							qs.before = options.before;
						}
						if (options.after) {
							qs.after = options.after;
						}

						if (returnAll) {
							responseData = await threadsApiRequestAllItems.call(
								this,
								`/${mediaId}/conversation`,
								qs,
								0,
							);
						} else {
							const limit = this.getNodeParameter('limit', i, 20) as number;
							responseData = await threadsApiRequestAllItems.call(
								this,
								`/${mediaId}/conversation`,
								qs,
								limit,
							);
						}
					} else if (operation === 'manage') {
						const mediaId = this.getNodeParameter('mediaId', i) as string;
						const hide = this.getNodeParameter('hide', i) as boolean;
						responseData = await threadsApiRequest.call(
							this,
							'POST',
							`/${mediaId}/manage_reply`,
							{},
							{ hide: hide.toString() },
						);
					}
				}

				// =================================================================
				//                               INSIGHT
				// =================================================================
				else if (resource === 'insight') {
					if (operation === 'getMedia') {
						const mediaId = this.getNodeParameter('mediaId', i) as string;
						const metrics = this.getNodeParameter('mediaMetrics', i) as string[];
						responseData = await threadsApiRequest.call(
							this,
							'GET',
							`/${mediaId}/insights`,
							{},
							{ metric: metrics.join(',') },
						);
					} else if (operation === 'getUser') {
						const userId = this.getNodeParameter('userId', i, 'me') as string;
						const metrics = this.getNodeParameter('userMetrics', i) as string[];
						const options = this.getNodeParameter('options', i, {}) as IDataObject;

						const qs: IDataObject = {
							metric: metrics.join(','),
						};

						if (options.since) {
							qs.since = Math.floor(new Date(options.since as string).getTime() / 1000);
						}
						if (options.until) {
							qs.until = Math.floor(new Date(options.until as string).getTime() / 1000);
						}

						responseData = await threadsApiRequest.call(
							this,
							'GET',
							`/${userId}/threads_insights`,
							{},
							qs,
						);
					}
				}

				// =================================================================
				//                               SEARCH
				// =================================================================
				else if (resource === 'search') {
					if (operation === 'keyword') {
						const query = this.getNodeParameter('query', i) as string;
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						const options = this.getNodeParameter('options', i, {}) as IDataObject;

						const qs: IDataObject = {
							q: query,
							search_type: 'posts',
						};

						if (options.fields) {
							qs.fields = formatFields(options.fields as string | string[]);
						}

						if (returnAll) {
							responseData = await threadsApiRequestAllItems.call(
								this,
								'/keyword_search',
								qs,
								0,
							);
						} else {
							const limit = this.getNodeParameter('limit', i, 20) as number;
							responseData = await threadsApiRequestAllItems.call(
								this,
								'/keyword_search',
								qs,
								limit,
							);
						}
					}
				}

				const executionData = this.helpers.constructExecutionMetaData(
					this.helpers.returnJsonArray(responseData),
					{ itemData: { item: i } },
				);

				returnData.push(...executionData);
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: this.getInputData(i)[0].json,
						error: new NodeApiError(this.getNode(), error as JsonObject, { itemIndex: i }),
						pairedItem: i,
					});
				} else {
					throw new NodeApiError(this.getNode(), error as JsonObject, {
						itemIndex: i,
					});
				}
			}
		}

		return [returnData];
	}
}
