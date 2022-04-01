import { GQLVariable, MembershipInput, useSingleTenantMutation } from "@contember/admin"

const UPDATE_MUTATION = `
	updateProjectMember(
		identityId: $identityId,
		projectSlug: $projectSlug,
		memberships: $memberships
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
	memberships: GQLVariable.Required(GQLVariable.List(MembershipInput)),
}

type UpdateErrorCodes =
	| 'PROJECT_NOT_FOUND'
	| 'INVALID_MEMBERSHIP'

export const useUpdate = () => useSingleTenantMutation<{ person: { id: string, identity: { id: string } } }, UpdateErrorCodes, typeof updateVariables>(UPDATE_MUTATION, updateVariables)
