import * as React from 'react'
import { CreatePage, HiddenField, RadioField, SelectField, TextField } from '@contember/admin'
import { useInviteManager } from '../hooks/useInviteManager'

export default () => (
	<CreatePage
		entity={'OrganizationManager'}
		onBeforePersist={useInviteManager()}
		redirectOnSuccess={'organizationManagerList'}
	>
		<HiddenField field={'personId'} label={undefined} />
		<HiddenField field={'identityId'} label={undefined} />
		<SelectField label={'Organizace'} options={'Organization.name'} field={'organization'} />
		<TextField field={'name'} label={'Jméno'} />
		<TextField field={'email'} label={'E-mail'} />
		<TextField field={'phone'} label={'Telefon'} />
		<RadioField field={'role'} label={'Role'} options={[{ value: 'organizationManager', label: 'Pracovník' }, { value: 'organizationAdmin', label: 'Admin' }, { value: 'admin', label: 'Superadministrátor' }]} />
	</CreatePage>
)
