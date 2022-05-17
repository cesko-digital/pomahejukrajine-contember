import * as React from 'react'
import {
	BooleanFieldView,
	Button,
	CheckboxField,
	Component,
	EditPage,
	Field,
	FieldContainer,
	GQLVariable,
	useField,
	useProjectSlug,
	useShowToast,
	useSingleTenantMutation,
} from '@contember/admin'
import { VolunteerForm } from '../forms/volunteersForms'
import { useCallback } from 'react'
import { RoleConditional } from '../components/RoleConditional'


const REMOVE_MUTATION = `
	removeProjectMember(
		identityId: $identityId,
		projectSlug: $projectSlug,
	) {
		ok
		errors {
			code
		}
	}
`

const updateVariables = {
	projectSlug: GQLVariable.Required(GQLVariable.String),
	identityId: GQLVariable.Required(GQLVariable.String),
}

type UpdateErrorCodes =
	| 'PROJECT_NOT_FOUND'
	| 'INVALID_MEMBERSHIP'

export const useDelete = () => useSingleTenantMutation<{ person: { id: string, identity: { id: string } } }, UpdateErrorCodes, typeof updateVariables>(REMOVE_MUTATION, updateVariables)

const useDeleteUser = () => {
	const project = useProjectSlug()
	const deleteUser = useDelete()
	const toast = useShowToast()
	const identityId = useField<string>('identityId').value

	return useCallback(async () => {
		if(!confirm('Opravdu chcete uživatele odstranit z projektu?')) return
		const result = await deleteUser({
			identityId: identityId!,
			projectSlug: project!,
		})
		if (!result.ok) {
			toast({
				message: `Nepovedlo se upravit osobu`,
				dismiss: true,
				type: 'error',
			})
			return
		} else {
			toast({
				message: `Osoba byla odstraněna`,
				dismiss: true,
				type: 'success',
			})
			return
		}
	}, [])
}

const DeleteButton = Component(
	() => {

		const deleteUser = useDeleteUser()

		return (
            <div className={`offerBanner`}>
                <p>Smazat uživatele? Operaci nelze vrátit zpět.</p>
                <Button
                    onClick={deleteUser}
                >
                    {'Odstranit uživatele'}
                </Button>
            </div>
		)
	},
	() => (<Field field={'identityId'} />),
	'DeleteButton',
)

export default (
	<EditPage entity="Volunteer(id=$id)" rendererProps={{ title: "Dobrovolník" }}>
		<VolunteerForm />
		<CheckboxField field="banned" label="Zablokován" defaultValue={false} />
		<FieldContainer label="Registrován administrátorem" useLabelElement={false}>
			<BooleanFieldView field="createdInAdmin" />
		</FieldContainer>
		<RoleConditional role={['admin', 'organizationAdmin']}>
			<DeleteButton />
		</RoleConditional>
	</EditPage>
)
