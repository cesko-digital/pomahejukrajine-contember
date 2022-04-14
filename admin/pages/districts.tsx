import { MultiEditPage, Repeater, TextField } from '@contember/admin'
import * as React from 'react'

export default (
	<MultiEditPage entities="Region" orderBy="name" rendererProps={{ title: "Kraje" }}>
		<div className="translatedFields">
			<TextField field="name" label="Název kraje" />
			<TextField field="nameUK" label="Název kraje v Ukrajinštině" />
		</div>
		<Repeater label="Okres" field="districts" orderBy="name">
			<div className="translatedFields">
				<TextField field="name" label="Název" />
				<TextField field="nameUK" label="Název v Ukrajinštině" />
			</div>
		</Repeater>
	</MultiEditPage>
)
