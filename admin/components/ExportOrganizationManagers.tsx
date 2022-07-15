import { Button, Component, useCurrentContentGraphQlClient } from "@contember/admin"
import Papa from "papaparse"
import * as React from "react"

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
			role
		}
	}
`

type ListOrganizationManagerQueryResult = {
	listOrganizationManager: OrganizationManager[]
}

type OrganizationManager = { id: string; name: string, email: string, phone: string, organization: { name: string }, role: string }

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
				return [manager.name, manager.email, manager.phone, manager.organization?.name, manager.role]
			})

			const blob = new Blob([Papa.unparse(csv, { delimiter: ';' })], { type: 'text/csv;charset=utf-8;' })
			return <a href={URL.createObjectURL(blob)} download="organization-managers.csv"><Button distinction="outlined">Stáhnout</Button></a>
		} else {
			return (
				<Button
					onClick={async () => {
						setPrepareDownload(true)
						setTimeout(async () => setOrganizationManagers(await handler()), 1500)
					}}
					distinction="outlined"
					loading={prepareDownload}
				>
					Export
				</Button>
			)
		}
	},
	() => null,
	'ExportOrganizationManagers'
)
