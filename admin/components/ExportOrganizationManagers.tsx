import * as React from "react"
import { Button, Component, useCurrentContentGraphQlClient } from "@contember/admin"

const LIST_ORGANIZATION_MANAGERS_QUERY = `
	query {
		listOrganizationManager {
			id
			name
			email
			phone
			organization {
				name
			}
		}
	}
`

type ListOrganizationManagerQueryResult = {
	listOrganizationManager: OrganizationManager[]
}

type OrganizationManager = { id: string; name: string, email: string, phone: string, organization: { name: string } }

export const ExportOrganizationManagers = Component(
	() => {
		const client = useCurrentContentGraphQlClient()
		const [prepareDownload, setPrepareDownload] = React.useState<boolean>(false)
		const [organizationManagers, setOrganizationManagers] = React.useState<any>(null)
		const handler = React.useCallback(async () => {
			return await client.sendRequest<ListOrganizationManagerQueryResult>(LIST_ORGANIZATION_MANAGERS_QUERY, {})
		}, [client])

		if (organizationManagers) {
			const csv = organizationManagers.data?.listOrganizationManager?.map((manager: OrganizationManager) => {
				return JSON.stringify([manager.name, manager.email, manager.phone, manager.organization?.name])
			}).join('\n').replace(/(^\[)|(\]$)/mg, '')
			const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
			return <a href={URL.createObjectURL(blob)} download="organization-managers.csv"><Button distinction="outlined">Stáhnout</Button></a>
		} else {
			return (
				<Button
					onClick={async () => {
						setPrepareDownload(true)
						setTimeout(async () => setOrganizationManagers(await handler()), 1500)
					}}
					distinction="outlined"
					isLoading={prepareDownload}
				>
					Export
				</Button>
			)
		}
	},
	() => null,
	'ExportOrganizationManagers'
)
