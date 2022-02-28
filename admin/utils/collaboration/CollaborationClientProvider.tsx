import * as React from 'react'
import { useProjectSlug } from "@contember/admin"
import { useMemo, memo, useState } from "react"
import { CollaborationClient } from "./CollaborationClient"
import { CollaborationClientContext } from "./CollaborationClientContext"

export const CollaborationClientProvider = memo(({ children }) => {
	const project = useProjectSlug()

	if (!project) {
		throw new Error("CollaborationClientProvider cannot get project slug")
	}

	const [clientId] = useState(() => Math.random().toString(36).substr(2, 9))

	const client = useMemo(() => {
		return new CollaborationClient(project, clientId)
	}, [project, clientId])

	return (
		<CollaborationClientContext.Provider value={client}>
			{children}
		</CollaborationClientContext.Provider>
	)
})
