import * as React from "react"
import { Button, Component, useCurrentContentGraphQlClient } from "@contember/admin"
import Papa from "papaparse"

const LIST_ORGANIZATION_QUERY = `
query {
	listOrganization {
		name
		address
		identificationNumber
		website
		note
		parentOrganization
		organizationType
		districts { name }
		region { name }
		nickname
		dateRegistered
	}
}
`

type ListOrganizationQueryResult = {
	listOrganization: Organization[]
}

type Organization = { name: string, address: string, identificationNumber: string, website: string, note: string, parentOrganization: string, organizationType: string, districts: [{ name: string }], region: { name: string }, nickname: string, dateRegistered: string }

export const ExportOrganization = Component(
	() => {
		const client = useCurrentContentGraphQlClient()
		const [prepareDownload, setPrepareDownload] = React.useState<boolean>(false)
		const [organizations, setOrganization] = React.useState<any>(null)
		const handler = React.useCallback(async () => {
			return await client.sendRequest<ListOrganizationQueryResult>(LIST_ORGANIZATION_QUERY, {})
		}, [client])

		if (organizations) {
			const csv = organizations.data?.listOrganization?.map((organization: Organization) => {
				let districtNames = organization.districts?.map(district => district.name).join(", ");

				return [organization.name, organization.address, organization.identificationNumber, organization.website, organization.note, organization.parentOrganization, organization.organizationType, districtNames, organization.region?.name, organization.nickname, organization.dateRegistered]
			})
			csv.unshift(['Název', 'Adresa', 'IČ', 'Web', 'Poznámka', 'Mateřská organizace', 'Typ organizace', 'Kraj', 'Okres', 'Zkratka', 'Datum registrace'])

			const blob = new Blob([Papa.unparse(csv, { delimiter: ';' })], { type: 'text/csv;charset=utf-8;' })
			return <a href={URL.createObjectURL(blob)} download="organizations.csv"><Button distinction="outlined">Stáhnout</Button></a>
		} else {
			return (
				<Button
					onClick={async () => {
						setPrepareDownload(true)
						setTimeout(async () => setOrganization(await handler()), 1500)
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
	'ExportOrganization'
)
