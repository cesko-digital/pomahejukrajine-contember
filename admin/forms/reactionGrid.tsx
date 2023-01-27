import {
	Component,
	DateCell,
	GenericCell,
	HasOneSelectCell,
	LinkButton,
	TextCell,
} from "@contember/admin";
import * as React from "react";

export const GridContent = Component(
	() => (
		<>
			<GenericCell shrunk canBeHidden>
				<LinkButton to="reactionView(id: $entity.id)">Otevřít</LinkButton>
			</GenericCell>
			<TextCell field="email" header="E-mail" />
			<TextCell field="phone" header="E-mail" />
			<HasOneSelectCell
				field="offer"
				header="Nabídka kód"
				options="Offer.code"
			/>
			<HasOneSelectCell
				field="offer"
				header="Nabídka název"
				options="Offer.name"
			/>
			<DateCell field="createdAt" header="Vytvořeno" initialOrder="desc" />
		</>
	),
	"GridContent"
);
