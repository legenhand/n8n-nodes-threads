import type {
	IDataObject,
	INodeType,
	INodeTypeDescription,
	IWebhookFunctions,
	IWebhookResponseData,
} from 'n8n-workflow';
import { NodeConnectionTypes } from 'n8n-workflow';

// eslint-disable-next-line @n8n/community-nodes/webhook-lifecycle-complete
export class ThreadsTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Threads Trigger',
		name: 'threadsTrigger',
		icon: { light: 'file:threads.svg', dark: 'file:threads.dark.svg' },
		group: ['trigger'],
		version: 1,
		subtitle: '={{$parameter["event"] || "Webhook"}}',
		description: 'Handle incoming Meta Threads webhook events (mentions, replies, etc.)',
		defaults: {
			name: 'Threads Trigger',
		},
		inputs: [],
		outputs: [NodeConnectionTypes.Main],
		webhooks: [
			{
				name: 'setup',
				httpMethod: 'GET',
				responseMode: 'onReceived',
				path: 'webhook',
			},
			{
				name: 'default',
				httpMethod: 'POST',
				responseMode: 'onReceived',
				path: 'webhook',
			},
		],
		properties: [
			{
				displayName: 'Verify Token',
				name: 'verifyToken',
				type: 'string',
				typeOptions: {
					password: true,
				},
				default: '',
				required: true,
				description: 'The verify token configured in Meta App Dashboard for Threads Webhooks',
			},
			{
				displayName: 'Events',
				name: 'event',
				type: 'options',
				options: [
					{
						name: 'All Events',
						value: 'all',
					},
					{
						name: 'Mentions',
						value: 'threads_mentions',
					},
					{
						name: 'Replies',
						value: 'threads_replies',
					},
				],
				default: 'all',
				description: 'The events to filter for',
			},
			{
				displayName: 'Options',
				name: 'options',
				type: 'collection',
				placeholder: 'Add Option',
				default: {},
				options: [
					{
						displayName: 'Only Changes',
						name: 'onlyChanges',
						type: 'boolean',
						default: true,
						description: 'Whether to extract and return each change object individually from the webhook payload',
					},
				],
			},
		],
	};

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		const req = this.getRequestObject();
		const res = this.getResponseObject();
		const query = this.getQueryData() as IDataObject;
		const configuredVerifyToken = this.getNodeParameter('verifyToken', '') as string;

		// Handle Meta Webhook Verification (GET request with hub.challenge)
		if (req.method === 'GET') {
			const mode = query['hub.mode'] as string;
			const token = query['hub.verify_token'] as string;
			const challenge = query['hub.challenge'] as string;

			if (mode === 'subscribe' && token === configuredVerifyToken) {
				res.status(200).send(challenge);
				return {
					noWebhookResponse: true,
				};
			}

			res.status(403).send('Forbidden');
			return {
				noWebhookResponse: true,
			};
		}

		// Handle incoming Webhook Events (POST request)
		const body = this.getBodyData() as IDataObject;
		const options = this.getNodeParameter('options', {}) as IDataObject;
		const selectedEvent = this.getNodeParameter('event', 'all') as string;
		const onlyChanges = (options.onlyChanges as boolean) ?? true;

		const returnData: IDataObject[] = [];

		if (onlyChanges && Array.isArray(body.entry)) {
			for (const entry of body.entry as IDataObject[]) {
				if (Array.isArray(entry.changes)) {
					for (const change of entry.changes as IDataObject[]) {
						const field = change.field as string;
						if (selectedEvent === 'all' || field === selectedEvent) {
							returnData.push({
								...change,
								entry_id: entry.id,
								entry_time: entry.time,
							});
						}
					}
				}
			}
		}

		if (returnData.length > 0) {
			return {
				workflowData: [this.helpers.returnJsonArray(returnData)],
			};
		}

		return {
			workflowData: [this.helpers.returnJsonArray(body)],
		};
	}
}
