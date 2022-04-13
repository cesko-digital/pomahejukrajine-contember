import * as React from 'react'
import { Component, EditPage, Field, HiddenField, NavigateBackButton, RadioField, SelectField, TextField, useIdentity } from '@contember/admin'
import { useUpdateManager } from '../hooks/useUpdateManager'

const RoleChange = Component(
	() => {
		// TODO: check admin role (blocked by better tenant api)
		return (
			<RadioField
				field={'role'}
				label={'Role'}
				options={[
					{ value: 'organizationManager', label: 'Pracovník' },
					{ value: 'organizationAdmin', label: 'Admin' },
					{ value: 'volunteer', label: 'Dobrovolník (nemá přístup do administrace)' },
				]}
			/>
		)
	},
	() => (
		<Field field="role" />
	),
	'RoleChange',
)


export default () => (
	<EditPage
		entity={'OrganizationManager(id = $id)'}
		onBeforePersist={useUpdateManager()}
		rendererProps={{
			title: 'Pracovník',
			navigation: <NavigateBackButton to="organizationManagerList">Zpět na výpis</NavigateBackButton>
		}}
	>
		<HiddenField field={'identityId'} label={undefined} />
		<SelectField label={'Organizace'} options={'Organization.name'} field={'organization'} />
		<TextField field={'name'} label={'Jméno'} />
		<TextField field={'email'} label={'E-mail'} />
		<TextField field={'phone'} label={'Telefon'} />
		<RoleChange />
	</EditPage>
)
