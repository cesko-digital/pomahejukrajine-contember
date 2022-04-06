import * as React from 'react'
import { MultiEditPage, TextField } from '@contember/admin'

export default (
	<MultiEditPage entities="VolunteerTag" rendererProps={{ sortableBy: "order", title: "Tagy pro dobrovolníky" }}>
		<TextField field="name" label="Název" />
	</MultiEditPage>
)
