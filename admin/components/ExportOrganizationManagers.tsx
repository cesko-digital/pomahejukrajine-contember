import * as React from "react"
import { Button, Component, useAuthedContentQuery } from "@contember/admin"

const LIST_ORGANIZATION_MANAGERS_QUERY = `
	query {
		listOrganizationManager {
			id
			name
			email
			phone
		}
	}
`

type ListOrganizationManagerQueryResult = {
	listOrganizationManager: OrganizationManager[]
}

type OrganizationManager = { id: string; name: string, email: string, phone: string }

export const ExportOrganizationManagers = Component(
	() => {
		const { state: query } = useAuthedContentQuery<ListOrganizationManagerQueryResult, {}>(LIST_ORGANIZATION_MANAGERS_QUERY, {})

		if (query.state !== 'success') {
			return <></>
		}

		const csv = query.data?.listOrganizationManager?.map((manager: OrganizationManager) => {
			return JSON.stringify([manager.name, manager.email, manager.phone])
		})
			.join('\n')
			.replace(/(^\[)|(\]$)/mg, '')

		const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })

		return <a href={URL.createObjectURL(blob)} download="organization-managers.csv"><Button distinction="seamless">Export</Button></a>
	},
	() => null,
	'ExportOrganizationManagers'
)
