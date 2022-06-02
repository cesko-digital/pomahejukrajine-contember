import { CheckboxField, DerivedFieldLink, Repeater, SelectField, TextField, Component } from '@contember/admin'
import * as React from 'react'
import { Conditional } from '../components/Conditional'

export const OfferTypeForms = Component(
	() => (
		<>
			<div className="translatedFields">
				<TextField field="name" label="Název" />
				<TextField field="nameUK" label="Název v Ukrajinštině" />
			</div>
			<CheckboxField field="hideInDemand" label="Skrýt v žádostech" defaultValue={false} />
			<div className="translatedFields">
				<TextField field="infoText" label="Doplňující informace" />
				<TextField field="infoTextUK" label="Doplňující informace v Ukrajinštině" />
			</div>
			<CheckboxField field="needsVerification" label="Pouze pro administrátory" defaultValue={false} />
			<Repeater field="questions" label="Otázky" sortableBy="order">
				<div className="translatedFields">
					<TextField field="question" label="Otázka (pro web)" />
					<TextField field="questionUK" label="Otázka (pro web) v Ukrajinštině" />
				</div>
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
						{ value: 'image', label: 'Nahrání obrázku' },
					]}
				/>
				<Conditional showIf={acc => ['radio', 'checkbox'].includes(acc.getField<string>('type').value ?? '')}>
					<Repeater field="options" label="Možnosti" sortableBy="order">
						<div className="translatedFields">
							<TextField field="label" label="Popisek (pro web)" />
							<TextField field="labelUK" label="Popisek (pro web) v Ukrajinštině" />
						</div>
						<TextField field="value" label="Hodnota (pro administraci)" />
						<DerivedFieldLink sourceField="label" derivedField="value" />
						<CheckboxField field="requireSpecification" label="Požadovat dovysvětlení (textové pole)" defaultValue={false} />
					</Repeater>
				</Conditional>
			</Repeater>
		</>
	),
	'OfferTypeForms',
)
