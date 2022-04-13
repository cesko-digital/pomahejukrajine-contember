import * as React from "react"
import { DataGridPage, DeleteEntityButton, EnumCell, GenericCell, HasOneSelectCell, LinkButton, TextCell } from "@contember/admin"
import { ExportOrganizationManagers } from "../components/ExportOrganizationManagers"

export default (
	<DataGridPage entities="OrganizationManager" itemsPerPage={100} rendererProps={{
		title: 'Pracovníci', actions: <>
			<ExportOrganizationManagers />
			<LinkButton to={'organizationManagerAdd'}>Pridat</LinkButton>
		</>
	}}>
		<HasOneSelectCell options={'Organization.name'} field={'organization'} header={'Organizece'} />
		<TextCell field="name" header="Jméno" />
		<TextCell field="email" header="Email" />
		<TextCell field="phone" header="Telefon" />
		<EnumCell field="role" options={{ organizationManager: "Pracovník", organizationAdmin: "Admin", volunteer: "Dobrovolník" }} header={'Role'} />
		<GenericCell canBeHidden={false} shrunk>
			<LinkButton to="organizationManagerEdit(id: $entity.id)">Detail</LinkButton>
		</GenericCell>
	</DataGridPage >
)
