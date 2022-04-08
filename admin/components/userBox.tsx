import {
	useIdentity,
	UserMiniControl,
} from '@contember/admin'
import React from 'react'

export const UserBox: React.FunctionComponent = () => {
	const { email } = useIdentity()

	return (
			<UserMiniControl
				name={email}
				note="Přihlášený uživatel"
			/>
	)
}
