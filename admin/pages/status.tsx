import { MultiEditPage, SelectField, TextField } from '@contember/admin'
import * as React from 'react'

export default (
	<MultiEditPage entities="OfferStatus" rendererProps={{ sortableBy: "order", title: "Stavy nabídek" }}>
		<TextField field="name" label="Název" />
		<SelectField
			field="type"
			label="Typ"
			allowNull
			options={[
				{ label: "Kapacity vyčerpána", value: "capacity_exhausted" },
				{ label: "Špatná zkušenost s nabídkou", value: "bad_experience" },
				{ label: "Již není aktuální", value: "outdated" },
			]}
		/>
	</MultiEditPage>
)
