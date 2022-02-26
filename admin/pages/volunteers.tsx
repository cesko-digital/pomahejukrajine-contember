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
	FieldContainer, GenericCell,
	HasManySelectCell,
	HiddenField, LinkButton,
	NumberField,
	Repeater,
	SelectField,
	TextAreaField,
	TextCell,
	TextField,
	MultiSelectField,
	FieldView, StaticRender, Field, DataGrid, TitleBar,
} from '@contember/admin'
import {Conditional} from "../components/Conditional";

export const volunteers = (
	<DataGridPage entities="Volunteer[verified=true][banned=false]" itemsPerPage={100} rendererProps={{ title: "Dobrovolníci" }}>
		<TextCell field="email" header="Email" />
		<TextCell field="phone" header="Telefon" />
		<TextCell field="expertise" header="Odbornost" />
		<HasManySelectCell field="districts" options="District.name" header="Okresy" />
		<HasManySelectCell field="tags" options="VolunteerTag.name" header="Tagy" />
		<TextCell field="userNote" header="Poznámka uživatele" hidden />
		<TextCell field="internalNote" header="Interní poznámka" hidden />
		<DateCell field="createdAt" header="Datum registrace" hidden />
		<BooleanCell field="createdInAdmin" header="Registrován administrátorem" hidden />
		<GenericCell canBeHidden={false} shrunk>
			<LinkButton to="editVolunteer(id: $entity.id)">Detail</LinkButton>
		</GenericCell>
	</DataGridPage>
)

export const offers = (
	<EditPage entity="OfferType(id=$id)" rendererProps={{
		title: <>Nabídky <Field field="name" /></>,
	}}>
		{/*<TitleBar title="Typ nabídky" />*/}
		<DataGrid entities="Offer[type.id=$id][volunteer.verified=true][volunteer.banned=false]" itemsPerPage={100}>
			<BooleanCell field="exhausted" header="Vyčerpáno" />
			{/* TODO: Show only if relevant */}
			<TextCell field="capacity" header="Kapacita" />
			{/* TODO: Show "correct" label */}
			<TextCell field="userNote" header="Poznámka uživatele" />
			<TextCell field="internalNote" header="Interní poznámka" />
			<TextCell field="volunteer.email" header="Dobrovolník: Email" hidden />
			<TextCell field="volunteer.phone" header="Dobrovolník: Telefon" hidden />
			<TextCell field="volunteer.expertise" header="Dobrovolník: Odbornost" hidden />
			<HasManySelectCell field="volunteer.districts" options="District.name" header="Dobrovolník: Okresy" />
			<HasManySelectCell field="volunteer.tags" options="VolunteerTag.name" header="Dobrovolník: Tagy" />
			<TextCell field="volunteer.userNote" header="Dobrovolník: Poznámka uživatele" hidden />
			<TextCell field="volunteer.internalNote" header="Dobrovolník: Interní poznámka" hidden />
			<DateCell field="volunteer.createdAt" header="Dobrovolník: Datum registrace" hidden />
			<BooleanCell field="volunteer.createdInAdmin" header="Dobrovolník: Registrován administrátorem" hidden />
			<GenericCell canBeHidden={false} shrunk>
				<LinkButton to="editVolunteer(id: $entity.volunteer.id)">Dobrovolník</LinkButton>
			</GenericCell>
		</DataGrid>
	</EditPage>

)

const OfferForm = Component(
	() => (
		<>
			<SelectField
				label="Typ nabídky"
				field="type"
				options="OfferType"
				renderOption={(option) => option.getField('name').value}
				optionsStaticRender={(
					<>
						<Field field="name" />
						<Field field="hasCapacity" />
						<Field field="noteLabel" />
					</>
				)}
			/>

			<Conditional showIf={acc => acc.getEntity('type').existsOnServer}>
				<Conditional showIf={acc => acc.getField<boolean>('type.hasCapacity').value!}>
					<NumberField label="Kapacita" field="capacity" />
				</Conditional>

				<FieldView field="type.noteLabel" render={({ value }) => <TextAreaField field="userNote" label={value || "Poznámka uživatele"} />} />
				<StaticRender>
					<TextAreaField field="userNote" label="Poznámka uživatele" />
				</StaticRender>

				<TextAreaField field="internalNote" label="Interní poznámka" />
				<Conditional showIf={acc => acc.existsOnServer}>
					<CheckboxField field="exhausted" label="Vyčerpáno" defaultValue={false} />
				</Conditional>
			</Conditional>
		</>
	),
	'OfferForm',
)

const VolunteerForm = Component(
	() => (
		<>
			<TextField field="email" label="Email" />
			<TextField field="phone" label="Telefon" />
			<TextField field="expertise" label="Odbornost" />
			<MultiSelectField label="Okresy" field="districts" options="District.name" />
			<MultiSelectField label="Tagy" field="tags" options="VolunteerTag.name" />
			<TextAreaField field="userNote" label="Poznámka uživatele" />
			<TextAreaField field="internalNote" label="Interní poznámka" />
			<CheckboxField field="verified" label="Ověřený" defaultValue={false} />
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

