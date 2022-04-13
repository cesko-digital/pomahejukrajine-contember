import * as React from 'react'
import { Component, useProjectUserRoles } from '@contember/admin'

interface RoleConditionalProps {
	role?: string | string[]
	onlyRole?: string | string[]
	notRole?: string | string[]
	notOtherRole?: string | string[]
	children: React.ReactNode
	onlyVisual?: boolean
}

export const RoleConditional = Component<RoleConditionalProps>(
	({ role, notRole, onlyRole, notOtherRole, children, onlyVisual }) => {
		const roles = useProjectUserRoles()
		const _role = typeof role === "string" ? [role] : role
		const _onlyRole = typeof onlyRole === "string" ? [onlyRole] : onlyRole
		const _notRole = typeof notRole === "string" ? [notRole] : notRole
		const _notOtherRole = typeof notOtherRole === "string" ? [notOtherRole] : notOtherRole
		const show =
			(_role !== undefined ? _role.some(it => roles.has(it)) : true)
			&& (_onlyRole !== undefined ? Array.from(roles).every(it => _onlyRole.includes(it)) : true)
			&& (_notRole !== undefined ? _notRole.every(it => !roles.has(it)) : true)
			&& (_notOtherRole !== undefined ? !Array.from(roles).every(it => _notOtherRole.includes(it)) : true)

		if (show) {
			return <>{children}</>
		} else {
			if (onlyVisual) {
				return <div style={{ display: 'none' }}>{children}</div>
			} else {
				return null
			}
		}
	},
	({ children }) => {
		return <>{children}</>
	},
	'RoleConditional',
)
