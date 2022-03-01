import { hasOwnProperty, Json, JsonObject } from "./utils"

export class CollaborationClient {
	constructor(
		private readonly project: string,
		private readonly clientId: string,
	) {
		this.createConnection()
	}

	private connection?: WebSocket
	private connectedConnection: Promise<WebSocket> = new Promise(() => {})
	private lastRequestId = 0
	private responseWaiters = new Map<string, (response: { success: true, response: JsonObject } | { success: false, error: string }) => void>()
	private subscriptionListeners = new Map<string, (data: JsonObject) => void>()
	private subscriptionBuffer = new Map<string, JsonObject[]>()

	private createConnection() {
		let setConnectedConnecion = (connection: WebSocket): void => { throw new Error('Too early') }
		this.connectedConnection = new Promise(resolve => {
			setConnectedConnecion = (connection) => resolve(connection)
		})
		this.connection = new WebSocket(`ws${window.location.protocol === 'https:' ? 's' : ''}://${window.location.host}/${this.project}?clientId=${this.clientId}`)

		this.connection.addEventListener('open', () => {
			setConnectedConnecion(this.connection!)
		})

		this.connection.addEventListener('error', () => {
			this.createConnection()
		})

		this.connection.addEventListener('close', () => {
			console.log('Connection closed')
			this.createConnection()
		})

		this.connection.addEventListener('message', (event) => {
			const data = JSON.parse(event.data) as Json
			if (typeof data !== 'object' || data === null || !hasOwnProperty(data, 'type')) {
				throw new Error('Invalid message')
			}

			if (
				data.type === 'response'
				&& hasOwnProperty(data, 'requestId')
				&& typeof data.requestId === 'string'
				&& hasOwnProperty(data, 'success')
				&& typeof data.success === 'boolean'
			) {
				const { requestId, success } = data
				const waiter = this.responseWaiters.get(requestId)
				if (waiter) {
					if (success) {
						if (
							hasOwnProperty(data, 'response')
							&& typeof data.response === 'object'
							&& data.response !== null
						) {
							waiter({ success: true, response: data.response as JsonObject })
						} else {
							throw new Error('Invalid response')
						}
					} else {
						waiter({
							success: false,
							error: hasOwnProperty(data, 'error') && typeof data.error === 'string' ? data.error : 'Unknown error',
						})
					}
					this.responseWaiters.delete(requestId)
				} else {
					console.warn(`Received response for unknown request ${requestId}`)
				}

			} else if (
				data.type === 'subscription'
				&& hasOwnProperty(data, 'subscriptionId')
				&& typeof data.subscriptionId === 'string'
				&& hasOwnProperty(data, 'data')
				&& typeof data.data === 'object'
				&& data.data !== null
			) {
				const listener = this.subscriptionListeners.get(data.subscriptionId)

				if (listener) {
					listener(data.data as JsonObject)

				} else {
					let buffer = this.subscriptionBuffer.get(data.subscriptionId)
					if (!buffer) {
						buffer = []
						this.subscriptionBuffer.set(data.subscriptionId, buffer)
					}
					buffer.push(data.data as JsonObject)
				}

			} else {
				throw new Error(`Unknown message ${JSON.stringify(data)}`)
			}
		})
	}

	async sendRequest(method: string, request: JsonObject): Promise<JsonObject> {
		return new Promise((resolve, reject) => {
			const requestId = (this.lastRequestId++).toString()

			this.responseWaiters.set(requestId, (response) => {
				if (response.success) {
					resolve(response.response)
				} else {
					reject(new Error(response.error))
				}
			})

			this.connectedConnection.then(connection => connection.send(JSON.stringify({
				requestId: requestId,
				method,
				...request,
			})))
		})
	}

	subscribe(subscriptionId: string, listener: (data: JsonObject) => void) {
		this.subscriptionListeners.set(subscriptionId, listener)

		const buffer = this.subscriptionBuffer.get(subscriptionId)
		if (buffer) {
			for (const data of buffer) {
				listener(data)
			}
			this.subscriptionBuffer.delete(subscriptionId)
		}
	}
}
