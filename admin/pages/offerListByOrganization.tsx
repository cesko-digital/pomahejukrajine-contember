import * as React from "react";
import {
	DataGridPage,
	DateCell,
	HasOneSelectCell,
	TextCell,
} from "@contember/admin";

export default (
	<DataGridPage entities="Offer" rendererProps={{ title: "Čerpání nabídek" }}>
		<TextCell field="code" header="Nabídka kód" />
		<TextCell field="name" header="Nabídka název" />
		<DateCell field="createdAt" header="Vytvořeno" initialOrder="desc" />
		<HasOneSelectCell
			field="volunteer"
			header="Organizace"
			options="Volunteer.organization"
		/>
	</DataGridPage>
);
