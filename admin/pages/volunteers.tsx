import * as React from 'react'
import {
	BooleanCell,
	BooleanFieldView,
	CheckboxField,
	Component,
	CreatePage,
	DataGridPage,
	DateCell,
	EditPage,
	Field,
	FieldContainer,
	GenericCell,
	HasManySelectCell,
	HiddenField,
	LinkButton,
	MultiSelectField,
	Repeater,
	SelectField,
	TextAreaField,
	TextCell,
	TextField,
} from '@contember/admin'
import {HasManyCell} from "../components/HasManyCell";
import {OfferForm} from "../components/OfferForm";

const limitLength = (maxLength: number) => (value: any) => {
	if (typeof value !== 'string') {
		return value
	}
	if (value.length > maxLength) {
		return <span title={value}>{value.substr(0, maxLength) + '…'}</span>
	}
	return value
};

export const volunteers = (
	<DataGridPage entities="Volunteer[verified=true][banned=false]" itemsPerPage={100} rendererProps={{ title: "Dobrovolníci" }}>
		<TextCell field="email" header="Email" format={limitLength(30)} />
		<TextCell field="phone" header="Telefon" format={limitLength(30)} />
		<TextCell field="expertise" header="Odbornost" format={limitLength(30)} />
		<HasManyCell field="districts" entityList="District" hasOneField="district" header="Okresy">
			<Field field="name" />
		</HasManyCell>
		<HasManySelectCell field="tags" options="VolunteerTag.name" header="Tagy" />
		<TextCell field="userNote" header="Poznámka uživatele" hidden format={limitLength(30)} />
		<TextCell field="internalNote" header="Interní poznámka" hidden format={limitLength(30)} />
		<DateCell field="createdAt" header="Datum registrace" hidden />
		<BooleanCell field="createdInAdmin" header="Registrován administrátorem" hidden />
		<GenericCell canBeHidden={false} shrunk>
			<LinkButton to="editVolunteer(id: $entity.id)">Detail</LinkButton>
		</GenericCell>
	</DataGridPage>
)

const VolunteerForm = Component(
	() => (
		<>
			<MultiSelectField label="Tagy" field="tags" options="VolunteerTag.name" />
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

export const newVolunteer = (
	<CreatePage entity="Volunteer" rendererProps={{ title: "Registrovat dobrovolníka" }} redirectOnSuccess="index">
		<HiddenField label={undefined} field="createdInAdmin" defaultValue={true} />
		<VolunteerForm />
	</CreatePage>
)

export const editVolunteer = (
	<EditPage entity="Volunteer(id=$id)" rendererProps={{ title: "Dobrovolník" }}>
		<VolunteerForm />
		<CheckboxField field="banned" label="Zablokován" defaultValue={false} />
		<FieldContainer label="Registrován administrátorem" useLabelElement={false}>
			<BooleanFieldView field="createdInAdmin" />
		</FieldContainer>
	</EditPage>
)
