import * as React from "react"
import { MultiEditPage, TextField } from "@contember/admin"

export default (
	<MultiEditPage entities="Language" rendererProps={{ sortableBy: "order", title: "Jazyky" }}>
		<TextField field="name" label="Název" />
	</MultiEditPage>
)
