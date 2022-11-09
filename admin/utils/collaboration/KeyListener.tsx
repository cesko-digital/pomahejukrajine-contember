import { EntityId } from '@contember/admin'
import * as React from 'react'
import { CollaborationClientContext } from './CollaborationClientContext'
import { hasOwnProperty, JsonObject } from "./utils"

interface CollaborationKeyListenerProps {
	collaborationKey: EntityId
	children: (keyData: KeyData | undefined) => React.ReactElement
}

export interface KeyData {
	exclusive: boolean
	keys: Array<{
		identityId: string
		value: JsonObject
		client: {
			email: string
		}
	}>
}

const isKeyData = (data: unknown): data is KeyData => {
	return (
		typeof data === 'object' &&
		data !== null &&
		hasOwnProperty(data, 'exclusive') &&
		typeof data.exclusive === 'boolean' &&
		hasOwnProperty(data, 'keys') &&
		Array.isArray(data.keys) &&
		data.keys.every(key => (
			typeof key === 'object' &&
			key !== null &&
			hasOwnProperty(key, 'identityId') &&
			typeof key.identityId === 'string' &&
			hasOwnProperty(key, 'value') &&
			typeof key.value === 'object' &&
			key.value !== null &&
			hasOwnProperty(key, 'client') &&
			typeof key.client === 'object' &&
			key.client !== null &&
			hasOwnProperty(key.client, 'email') &&
			typeof key.client.email === 'string'
		))
	)
}

export const CollaborationKeyListener = React.memo<CollaborationKeyListenerProps>(({ collaborationKey, children }) => {
	const client = React.useContext(CollaborationClientContext)
	const [value, setValue] = React.useState<undefined | KeyData>(undefined)

	React.useEffect(() => {
		let resolve = (subscriptionId: string): void => { throw new Error('Too early') }
		const subscriptionIdPromise: Promise<string> = new Promise(r => resolve = ((s) => r(s)))

		;(async () => {
			const response = await client?.sendRequest('listen', { key: collaborationKey })
			const subscriptionId = response?.subscriptionId
			if (typeof subscriptionId === 'string') {
				resolve(subscriptionId)
				client!.subscribe(subscriptionId, newData => {
					if (isKeyData(newData)) {
						setValue(newData)
					} else {
						console.error('Invalid key data received', newData)
					}
				})
			} else {
				console.error('Invalid response received', response)
			}
		})()


		return () => {
			subscriptionIdPromise.then(subscriptionId => {
				client?.sendRequest('unsubscribe', { subscriptionId: subscriptionId })
			})
		}
	}, [client, collaborationKey])

	return children(value)
})

