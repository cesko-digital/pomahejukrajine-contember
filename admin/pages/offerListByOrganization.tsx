import * as React from "react";
import {
	DataGridPage,
	DateCell,
	HasOneSelectCell,
	TextCell,
} from "@contember/admin";
import { format } from 'date-fns'

export default (
	<DataGridPage entities="Offer" rendererProps={{ title: "Přehled čerpání nabídek" }}>
		<TextCell field="code" header="Nabídka kód" />
		<HasOneSelectCell
			field="type"
			header="Kategorie nabídky"
			options="OfferType.name"
		/>
		<DateCell field="createdAt" header="Vytvořeno" initialOrder="desc" format={(date) => format(date, 'dd. MM. y')} />
		<HasOneSelectCell
			field="volunteer"
			header="Organizace"
			options="Volunteer.organization"
		/>
	</DataGridPage>
);
