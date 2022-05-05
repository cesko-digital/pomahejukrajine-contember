import * as React from "react"
import { CreatePage, TextField } from "@contember/admin"
import { OrganizationForm } from "../forms/organizationForm"

export default (
	<CreatePage entity="Organization" redirectOnSuccess="organizations">
		<OrganizationForm />
	</CreatePage>
)
