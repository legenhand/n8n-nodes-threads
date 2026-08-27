import type {
	IDataObject,
	IExecuteFunctions,
	IHookFunctions,
	IHttpRequestMethods,
	IHttpRequestOptions,
	IWebhookFunctions,
	JsonObject,
} from 'n8n-workflow';
import { NodeApiError, NodeOperationError, sleep } from 'n8n-workflow';

export const THREADS_API_BASE_URL = 'https://graph.threads.net/v1.0';

/**
 * Helper to get the access token from either OAuth2 or direct API token credentials
 */
async function getAccessToken(
	context: IExecuteFunctions | IWebhookFunctions | IHookFunctions,
): Promise<string> {
	const authenticationMethod = context.getNodeParameter(
		'authentication',
		0,
		'oAuth2',
	) as 'oAuth2' | 'accessToken';

	if (authenticationMethod === 'oAuth2') {
		const credentials = await context.getCredentials('threadsOAuth2Api');
		const oauthTokenData = (credentials.oauthTokenData || {}) as IDataObject;
		return (
			(oauthTokenData.access_token as string) ||
			(credentials.accessToken as string) ||
			(oauthTokenData.accessToken as string) ||
			''
		);
	}

	const credentials = await context.getCredentials('threadsApi');
	return (credentials.accessToken as string) || '';
}

/**
 * Make an authenticated API request to Meta Threads API
 */
export async function threadsApiRequest(
	this: IExecuteFunctions | IWebhookFunctions | IHookFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body: IDataObject = {},
	qs: IDataObject = {},
): Promise<IDataObject> {
	const accessToken = await getAccessToken(this);

	const options: IHttpRequestOptions = {
		method,
		baseURL: THREADS_API_BASE_URL,
		url: endpoint,
		qs,
		json: true,
		headers: {
			Authorization: `Bearer ${accessToken}`,
		},
	};

	if (method === 'POST' || method === 'PUT' || method === 'PATCH') {
		if (Object.keys(body).length > 0) {
			// Threads API expects form-urlencoded or query parameters in many POST endpoints
			options.body = body;
		}
	}

	try {
		return await this.helpers.httpRequest.call(this, options);
	} catch (error) {
		throw new NodeApiError(this.getNode(), error as JsonObject);
	}
}

/**
 * Make an authenticated API request and handle automatic pagination
 */
export async function threadsApiRequestAllItems(
	this: IExecuteFunctions,
	endpoint: string,
	qs: IDataObject = {},
	limit = 50,
): Promise<IDataObject[]> {
	const returnData: IDataObject[] = [];
	let responseData: IDataObject;
	const query: IDataObject = {
		...qs,
		limit: Math.min(limit, 100),
	};

	let nextUrl: string | undefined;

	do {
		if (nextUrl) {
			const accessToken = await getAccessToken(this);
			try {
				responseData = await this.helpers.httpRequest.call(this, {
					method: 'GET',
					url: nextUrl,
					json: true,
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				});
			} catch (error) {
				throw new NodeApiError(this.getNode(), error as JsonObject);
			}
		} else {
			responseData = await threadsApiRequest.call(this, 'GET', endpoint, {}, query);
		}

		if (Array.isArray(responseData.data)) {
			for (const item of responseData.data) {
				returnData.push(item);
				if (limit > 0 && returnData.length >= limit) {
					return returnData.slice(0, limit);
				}
			}
		} else {
			break;
		}

		nextUrl = (responseData.paging as IDataObject)?.next as string | undefined;
	} while (nextUrl && (limit === 0 || returnData.length < limit));

	return returnData;
}

/**
 * Poll media container status until FINISHED, ERROR, or timeout
 */
export async function waitForContainerReady(
	this: IExecuteFunctions,
	containerId: string,
	maxAttempts = 30,
	delayMs = 2000,
): Promise<IDataObject> {
	for (let attempt = 0; attempt < maxAttempts; attempt++) {
		const statusResponse = await threadsApiRequest.call(
			this,
			'GET',
			`/${containerId}`,
			{},
			{ fields: 'id,status,error_message' },
		);

		const status = statusResponse.status;

		if (status === 'FINISHED') {
			return statusResponse;
		}

		if (status === 'ERROR') {
			throw new NodeOperationError(
				this.getNode(),
				`Media container ${containerId} processing failed: ${statusResponse.error_message || 'Unknown error'}`,
			);
		}

		if (status === 'EXPIRED') {
			throw new NodeOperationError(
				this.getNode(),
				`Media container ${containerId} has expired.`,
			);
		}

		// Wait before polling again
		await sleep(delayMs);
	}

	throw new NodeOperationError(
		this.getNode(),
		`Media container ${containerId} was not ready within timeout period.`,
	);
}

/**
 * Helper to publish a media container
 */
export async function publishContainer(
	this: IExecuteFunctions,
	userId: string,
	containerId: string,
): Promise<IDataObject> {
	return await threadsApiRequest.call(
		this,
		'POST',
		`/${userId}/threads_publish`,
		{},
		{ creation_id: containerId },
	);
}
