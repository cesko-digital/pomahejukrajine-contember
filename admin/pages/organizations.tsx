import {
	Component,
	CreatePage,
	DataGridPage,
	EditIdentity,
	EditPage,
	useAuthedTenantQuery,
	EntityAccessor,
	Field,
	GenericCell,
	HasOneSelectCell,
	HiddenField,
	LinkButton,
	RolesConfig,
	SelectField,
	TextCell,
	TextField,
	useField,
	useProjectSlug,
	useShowToast,
} from "@contember/admin"
import { useInvite } from "../hooks/useInvite"
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
		<HasOneSelectCell options={'Organization.name'} field={'organization'} />
		<TextCell field="name" header="Jméno" />
		<TextCell field="email" header="Email" />
		<TextCell field="phone" header="Telefon" />
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
		if (personId.value) {
			return
		}

		const result = await invite({
			email: String(accessor.getField('email').value),
			projectSlug: project!,
			memberships: [{ role: 'organizationManager', variables: [] }]
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
	}, [])
}
export const organizationManagerAdd = () => (
	<CreatePage entity={'OrganizationManager'} onBeforePersist={useInviteManager()} redirectOnSuccess={'organizationManagerList'}>
		<HiddenField field={'personId'} label={undefined} />
		<SelectField label={'Organizace'} options={'Organization.name'} field={'organization'} />
		<TextField field={'name'} label={'Jméno'} />
		<TextField field={'email'} label={'E-mail'} />
		<TextField field={'phone'} label={'Telefon'} />
	</CreatePage>
)

const LIST_PROJECT_MEMBER_QUERY = `
	query ListProjectMembers($projectSlug: String!) {
		projectBySlug(slug: $projectSlug) {
			id
			members {
				identity {
					id
					person {
						id
					}
				}
			}
		}
	}
`

type ListProjectMembers = {
	projectBySlug: {
		id: string
		members: {
			identity: {
				id: string
				person: {
					id: string
				}
			}
		}[]
	}
}

const rolesConfig: RolesConfig = {
	admin: {
		name: 'organizationManager',
		variables: {
			personID: {
				render: () => null,
			}
		},
	}
}

const EditUser = Component(
	() => {
		const project = useProjectSlug()
		const personId = useField<string>('personId').value
		const { state: query } = useAuthedTenantQuery<ListProjectMembers, {}>(LIST_PROJECT_MEMBER_QUERY, { projectSlug: project })

		if (!personId || !project || query.state !== 'success') {
			return null
		}

		const currentMember = query.data.projectBySlug.members.find(member => member.identity?.person?.id === personId)

		if (!currentMember) {
			return null
		}

		return <EditIdentity project={project} rolesConfig={rolesConfig} identityId={currentMember.identity.id} userListLink={'tenantUsers'} />
	},
	() => (
		<Field field="personId" />
	),
	'EditUser'
)

export const organizationManagerEdit = () => (
	<EditPage entity={'OrganizationManager(id = $id)'} rendererProps={{ title: 'Pracovník' }}>
		<SelectField label={'Organizace'} options={'Organization.name'} field={'organization'} />
		<TextField field={'name'} label={'Jméno'} />
		<TextField field={'email'} label={'E-mail'} />
		<TextField field={'phone'} label={'Telefon'} />
		<EditUser />
	</EditPage>
)
