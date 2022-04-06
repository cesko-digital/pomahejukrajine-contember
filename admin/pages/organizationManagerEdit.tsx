import * as React from 'react'
import { EditPage, HiddenField, RadioField, SelectField, TextField } from '@contember/admin'
import { useUpdateManager } from '../hooks/useUpdateManager'

export default () => (
	<EditPage entity={'OrganizationManager(id = $id)'} onBeforePersist={useUpdateManager()} rendererProps={{ title: 'Pracovník' }}>
		<HiddenField field={'identityId'} label={undefined} />
		<SelectField label={'Organizace'} options={'Organization.name'} field={'organization'} />
		<TextField field={'name'} label={'Jméno'} />
		<TextField field={'email'} label={'E-mail'} />
		<TextField field={'phone'} label={'Telefon'} />
		<RadioField field={'role'} label={'Role'} options={[{ value: 'organizationManager', label: 'Pracovník' }, { value: 'organizationAdmin', label: 'Admin' }]} />
	</EditPage>
)
