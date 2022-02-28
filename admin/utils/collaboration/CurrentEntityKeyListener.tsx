import { Component, EntityView } from "@contember/admin"
import { memo } from "react"
import { CollaborationKeyListener, KeyData } from "./KeyListener"

interface CurrentEntityKeyListenerProps {
	children: (keyData: KeyData | undefined) => React.ReactElement
}

export const CurrentEntityKeyListener = Component<CurrentEntityKeyListenerProps>(
	({ children }) => {
		return (
			<EntityView
				render={(entity) => (
					entity.idOnServer !== undefined
					? <CollaborationKeyListener collaborationKey={entity.idOnServer} children={children} />
					: children(undefined)
				)}
			/>
		)
	},
	() => null,
	'CurrentEntityKeyListener',
)
