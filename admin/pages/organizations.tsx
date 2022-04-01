import {
	CreatePage,
	DataGridPage,
	EditPage,
	EntityAccessor,
	EnumCell,
	GenericCell,
	HasOneSelectCell,
	HiddenField,
	LinkButton,
	RadioField,
	SelectField,
	TextCell,
	TextField,
	useProjectSlug,
	useShowToast,
} from "@contember/admin"
import { useInvite } from "../hooks/useInvite"
import { useUpdate } from "../hooks/useUpdate"
import * as React from "react"
import { useCallback } from "react"
import { ExportOrganizationManagers } from "../components/ExportOrganizationManagers"

export const organizations = (
	<DataGridPage entities="Organization" itemsPerPage={50} rendererProps={{ title: "Organizace", actions: <LinkButton to="organizationCreate">Přidat organizaci</LinkButton> }}>
		<TextCell field="name" header="Název" />
	</DataGridPage>
)

export const organizationCreate = (
	<CreatePage entity="Organization" redirectOnSuccess="organizations">
		<TextField field="name" label="Název" />
	</CreatePage>
)

export const organizationManagerList = (
	<DataGridPage entities="OrganizationManager" itemsPerPage={100} rendererProps={{
		title: 'Pracovníci', actions: <>
			<ExportOrganizationManagers />
			<LinkButton to={'organizationManagerAdd'}>Pridat</LinkButton>
		</>
	}}>
		<HasOneSelectCell options={'Organization.name'} field={'organization'} header={'Organizece'} />
		<TextCell field="name" header="Jméno" />
		<TextCell field="email" header="Email" />
		<TextCell field="phone" header="Telefon" />
		<EnumCell field="role" options={{ organizationManager: "Pracovník", organizationAdmin: "Admin" }} header={'Role'} />
		<GenericCell canBeHidden={false} shrunk>
			<LinkButton to="organizationManagerEdit(id: $entity.id)">Detail</LinkButton>
		</GenericCell>
	</DataGridPage >
)

const useInviteManager = () => {
	const invite = useInvite()
	const project = useProjectSlug()
	const toast = useShowToast()

	return useCallback(async (getAccessor: () => EntityAccessor) => {
		const accessor = getAccessor()
		const personId = accessor.getField('personId')
		const identityId = accessor.getField('identityId')
		const role = accessor.getField<string>('role').value
		if (personId.value || !role) {
			return
		}

		const result = await invite({
			email: String(accessor.getField('email').value),
			projectSlug: project!,
			memberships: [{ role, variables: [] }]
		})
		if (!result.ok) {
			toast({
				message: `Nepovedlo se pozvat osobu: ${result.error.developerMessage}`,
				dismiss: true,
				type: 'error',
			})
			return
		}
		personId.updateValue(result.result.person.id)
		identityId.updateValue(result.result.person.identity.id)
	}, [])
}

export const organizationManagerAdd = () => (
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
		<RadioField field={'role'} label={'Role'} options={[{ value: 'organizationManager', label: 'Pracovník' }, { value: 'organizationAdmin', label: 'Admin' }]} />
	</CreatePage>
)

const useUpdateManager = () => {
	const update = useUpdate()
	const project = useProjectSlug()
	const toast = useShowToast()

	return useCallback(async (getAccessor: () => EntityAccessor) => {
		const accessor = getAccessor()
		const identityId = accessor.getField<string>('identityId').value
		const role = accessor.getField<string>('role').value

		const result = await update({
			identityId: identityId!,
			projectSlug: project!,
			memberships: [{ role: role!, variables: [] }]
		})
		if (!result.ok) {
			toast({
				message: `Nepovedlo se upravit osobu: ${result.error.developerMessage}`,
				dismiss: true,
				type: 'error',
			})
			return
		}
	}, [])
}

export const organizationManagerEdit = () => (
	<EditPage entity={'OrganizationManager(id = $id)'} onBeforePersist={useUpdateManager()} rendererProps={{ title: 'Pracovník' }}>
		<HiddenField field={'identityId'} label={undefined} />
		<SelectField label={'Organizace'} options={'Organization.name'} field={'organization'} />
		<TextField field={'name'} label={'Jméno'} />
		<TextField field={'email'} label={'E-mail'} />
		<TextField field={'phone'} label={'Telefon'} />
		<RadioField field={'role'} label={'Role'} options={[{ value: 'organizationManager', label: 'Pracovník' }, { value: 'organizationAdmin', label: 'Admin' }]} />
	</EditPage>
)
