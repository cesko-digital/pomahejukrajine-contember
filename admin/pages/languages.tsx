import * as React from "react"
import { MultiEditPage, TextField } from "@contember/admin"

export default (
	<MultiEditPage entities="Language" rendererProps={{ sortableBy: "order", title: "Jazyky" }}>
		<div className="translatedFields">
			<TextField field="name" label="Název" />
			<TextField field="nameUK" label="Název v Ukrajinštině" />
		</div>
	</MultiEditPage>
)
