import * as React from "react"
import {
	Block,
	CheckboxField, DerivedFieldLink,
	DiscriminatedBlocks,
	MultiEditPage,
	Repeater,
	Select,
	SelectField,
	TextField
} from "@contember/admin"
import {Conditional} from "../components/Conditional";
import {Language} from "../../api/model";

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


export const status = (
	<MultiEditPage entities="OfferStatus" rendererProps={{ sortableBy: "order", title: "Stavy nabídek" }}>
		<TextField field="name" label="Název" />
	</MultiEditPage>
)

export const languages = (
	<MultiEditPage entities="Language" rendererProps={{ sortableBy: "order", title: "Jazyky" }}>
		<TextField field="name" label="Název" />
	</MultiEditPage>
)

export const offerTypes = (
	<MultiEditPage entities="OfferType" rendererProps={{ sortableBy: "order", title: "Typy nabídek" }}>
		<TextField field="name" label="Název" />
		<TextField field="infoText" label="Doplňující informace" />
		<CheckboxField field="needsVerification" label="Vyžaduje ověření" defaultValue={false} />
		<Repeater field="questions" label="Otázky" sortableBy="order">
			<TextField field="question" label="Otázka (pro web)" />
			<TextField field="label" label="Popisek (pro administraci)" />
			<DerivedFieldLink sourceField="question" derivedField="label" />
			<CheckboxField field="required" label="Povinná" defaultValue={true} />
			<CheckboxField field="public" label="Zveřejnit odpovědi" defaultValue={false} />
			<SelectField
				label="Typ odpovědi"
				field="type"
				options={[
					{ value: 'radio', label: 'Výběr jedné možnosti' },
					{ value: 'checkbox', label: 'Výběr více možností' },
					{ value: 'text', label: 'Text' },
					{ value: 'textarea', label: 'Víceřádkový text' },
					{ value: 'number', label: 'Číslo' },
					{ value: 'date', label: 'Datum' },
					{ value: 'district', label: 'Výběr okresu' },
				]}
			/>
			<Conditional showIf={acc => ['radio', 'checkbox'].includes(acc.getField<string>('type').value ?? '')}>
				<Repeater field="options" label="Možnosti" sortableBy="order">
					<TextField field="label" label="Popisek (pro web)" />
					<TextField field="value" label="Hodnota (pro administraci)" />
					<DerivedFieldLink sourceField="label" derivedField="value" />
					<CheckboxField field="requireSpecification" label="Požadovat dovysvětlení (textové pole)" defaultValue={false} />
				</Repeater>
			</Conditional>
		</Repeater>
	</MultiEditPage>
)
