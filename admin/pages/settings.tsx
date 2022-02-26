import * as React from "react"
import { CheckboxField, MultiEditPage, Repeater, TextField } from "@contember/admin"

export const districts = (
	<MultiEditPage entities="Region" orderBy="name" rendererProps={{ title: "Kraje" }}>
		<TextField field="name" label="Název kraje" />
		<Repeater label="Okres" field="districts" orderBy="name">
			<TextField field="name" label={undefined} />
		</Repeater>
	</MultiEditPage>
)

export const tags = (
	<MultiEditPage entities="VolunteerTag" rendererProps={{ sortableBy: "order", title: "Tagy pro dobrovolníky" }}>
		<TextField field="name" label="Název" />
	</MultiEditPage>
)

export const offerTypes = (
	<MultiEditPage entities="OfferType" rendererProps={{ sortableBy: "order", title: "Typy nabídek" }}>
		<TextField field="name" label="Název" />
		<CheckboxField field="hasCapacity" label="Má kapacitu (počet osob)" defaultValue={false} />
		<CheckboxField field="noteRequired" label="Povinná poznámka" defaultValue={false} />
		<TextField field="noteLabel" label="Popisek k poznámce" />
	</MultiEditPage>
)
