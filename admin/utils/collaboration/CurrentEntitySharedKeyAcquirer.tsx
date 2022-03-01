import * as React from 'react'
import { EntityView } from "@contember/admin"
import { memo } from "react"
import { SharedKeyAcquirer } from "./SharedKeyAcquirer"
import { JsonObject } from "./utils"

interface CurrentEntitySharedKeyAcquirerProps {
	value?: JsonObject
	children?: undefined
}

export const CurrentEntitySharedKeyAcquirer = memo<CurrentEntitySharedKeyAcquirerProps>(({ value }) => {
	return (
		<EntityView
			render={(entity) => (
				entity.idOnServer !== undefined
				? <SharedKeyAcquirer collaborationKey={entity.idOnServer} value={value} />
				: null
			)}
		/>
	)
})
