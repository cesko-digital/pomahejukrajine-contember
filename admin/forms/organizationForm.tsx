import * as React from 'react'
import { Component, SelectField, TextAreaField, TextField } from '@contember/admin'

export const OrganizationForm = Component(
	() => (
		<>
			<TextField field="name" label="Název" />
			<TextField field="nickname" label="Zkratka" />
			<TextAreaField field="address" label="Adresa" />
			<SelectField field="region" label="Kraj" options="Region.name" />
			<SelectField field="district" label="Okres" options="District.name" />
			<TextField field="identificationNumber" label="IČ" />
			<SelectField field="organizationType" label="Typ organizace" options={[
				{ label: 'Školské zařízení', value: 'collegeInitiative' },
				{ label: 'Výzkumný a vysokoškolský sektor', value: 'researchAndUniversitySector' },
				{ label: 'Vládní a veřejná organizace', value: 'governmentOrganization' },
				{ label: 'Soukromý podnik', value: 'privateOrganization' },
				{ label: 'Ostatní', value: 'other' },
				{ label: 'Osoba - OSVČ', value: 'osvcPerson' },
				{ label: 'Obec', value: 'municipality' },
				{ label: 'Nevládní/nezisková organizace', value: 'nonprofit' },
				{ label: 'Nadace', value: 'foundation' },
				{ label: 'Média', value: 'media' },
				{ label: 'Církevní organizace', value: 'church' },
				{ label: 'Dobrovolnická iniciativa', value: 'volunteerInitiative' },
			]} />
			<TextField field="website" label="Web" />
			<TextField field="parentOrganization" label="Mateřská organizace" />
			<TextAreaField field="note" label="Poznámka" />
		</>
	),
	'VolunteerForm',
)
