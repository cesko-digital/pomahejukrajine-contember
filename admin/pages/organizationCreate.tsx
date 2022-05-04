import * as React from "react"
import { CreatePage, TextField } from "@contember/admin"

export default (
	<CreatePage entity="Organization" redirectOnSuccess="organizations">
		<TextField field="name" label="Název" />
		<TextField field="parentOrganization" label="Mateřská organizace" />
	</CreatePage>
)
