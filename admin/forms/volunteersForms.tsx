import * as React from 'react'
import { CheckboxField, Component, FieldView, MultiSelectField, Repeater, SelectField, TextAreaField, TextField } from '@contember/admin'
import { OfferForm } from '../components/OfferForm'

const communicationWithVolunteerEnum = {
	'not_set': 'Nenastaveno',
	'active': 'Aktivní',
	'does_not_exist': 'Neexistuje',
	'unreachable': 'Nedovoláno',
	'inactive': 'Neaktivní',
	'verified': 'Ověřeno',
}

export const VolunteerForm = Component(
	() => (
		<>
			<MultiSelectField label="Tagy" field="tags" options="VolunteerTag.name" />
			Komunikace s dobrovolníkem: <FieldView field="communicationWithVolunteer" render={(accessor) => accessor.value ? <>{communicationWithVolunteerEnum[accessor.value as keyof typeof communicationWithVolunteerEnum]}</> : ''} />
			<hr />
			<h3>Údaje o uživateli</h3>
			<TextField field="name" label="Jméno" />
			<TextField field="organization" label="Organizace" />
			<TextField field="contactHours" label="Můžete mne kontaktovat (čas)" />
			<TextField field="email" label="Email" />
			<TextField field="phone" label="Telefon" />
			<TextField field="expertise" label="Odbornost" />
			<Repeater field="languages" label="Jazyky" orderBy={undefined}>
				<SelectField label={undefined} options="Language.name" field="language" />
			</Repeater>
			<Repeater field="districts" label="Okresy" orderBy={undefined}>
				<SelectField label={undefined} options="District.name" field="district" />
			</Repeater>
			<TextAreaField field="userNote" label="Poznámka uživatele" />
			<TextAreaField field="internalNote" label="Interní poznámka" />
			<CheckboxField field="verified" label="Ověřený" defaultValue={false} />
			<hr />
			<h3>Co nabízí</h3>
			<Repeater field="offers" label="Nabídky" orderBy="type.order">
				<OfferForm />
			</Repeater>
		</>
	),
	'VolunteerForm',
)
