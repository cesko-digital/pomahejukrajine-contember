import { EntityId } from '@contember/admin'
import * as React from 'react'
import { CollaborationClientContext } from './CollaborationClientContext'
import { JsonObject } from './utils'

interface SharedKeyAcquirerProps {
	collaborationKey: EntityId
	value?: JsonObject
}

export const SharedKeyAcquirer = React.memo<SharedKeyAcquirerProps>(({ collaborationKey, value }) => {
	const client = React.useContext(CollaborationClientContext)

	React.useEffect(() => {
		client?.sendRequest('acquireShared', { key: collaborationKey, value: value ?? {} })

		return () => {
			client?.sendRequest('release', { key: collaborationKey })
		}
	}, [client, collaborationKey, value])

	return null
})

