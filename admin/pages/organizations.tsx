import * as React from "react"
import { DataGridPage, LinkButton, TextCell } from "@contember/admin"

export default (
	<DataGridPage entities="Organization" itemsPerPage={50} rendererProps={{ title: "Organizace", actions: <LinkButton to="organizationCreate">Přidat organizaci</LinkButton> }}>
		<TextCell field="name" header="Název" />
	</DataGridPage>
)
