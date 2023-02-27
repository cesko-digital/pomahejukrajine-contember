import * as React from "react";
import {
	DataGridPage,
	DateCell,
	Field,
	HasManySelectCell,
	HasOneSelectCell,
	TextCell,
} from "@contember/admin";
import { format } from 'date-fns'
import { HasManyCell } from '../components/HasManyCell'

export default (
	<DataGridPage entities="Offer" rendererProps={{ title: "Přehled čerpání nabídek" }}>
		<TextCell field="code" header="Nabídka kód" />
		<HasOneSelectCell
			field="type"
			header="Kategorie nabídky"
			options="OfferType.name"
		/>
		<DateCell field="createdAt" header="Vytvořeno" initialOrder="desc" format={(date) => format(date, 'dd. MM. y')} />
		<HasManySelectCell
			field="assignees"
			header="Pracovník"
			options={"OrganizationManager.name"}
			renderElements={(els) => (
				<span>
					{els.map((el) => (
						<span style={{ display: "block", fontSize: "90%" }}>
							{el}
						</span>
					))}
				</span>
			)}
		/>
		<HasManyCell
			field="assignees"
			header="Organizace pracovníka"
			entityList="OrganizationManager"
			hasOneField="organization"
		>
			<Field field="name" />
		</HasManyCell>
	</DataGridPage>
);
