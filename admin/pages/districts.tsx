import { MultiEditPage, Repeater, TextField } from '@contember/admin'
import * as React from 'react'

export default (
	<MultiEditPage entities="Region" orderBy="name" rendererProps={{ title: "Kraje" }}>
		<TextField field="name" label="Název kraje" />
		<Repeater label="Okres" field="districts" orderBy="name">
			<TextField field="name" label={undefined} />
		</Repeater>
	</MultiEditPage>
)
