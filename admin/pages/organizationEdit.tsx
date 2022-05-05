import * as React from "react"
import { EditPage, TextField } from "@contember/admin"
import { OrganizationForm } from "../forms/organizationForm"

export default (
	<EditPage entity="Organization(id = $id)" redirectOnSuccess="organizations">
		<OrganizationForm />
	</EditPage>
)
