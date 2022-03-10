import { GQLVariable, MembershipInput, useSingleTenantMutation } from "@contember/admin"

const INVITE_MUTATION = `
	invite(
		email: $email,
		projectSlug: $projectSlug,
		memberships: $memberships
	) {
		ok
		errors {
			code
		}
		result {
			person {
				id
				identity {
					id
				}
			}
		}
	}
`

const inviteVariables = {
	projectSlug: GQLVariable.Required(GQLVariable.String),
	email: GQLVariable.Required(GQLVariable.String),
	memberships: GQLVariable.Required(GQLVariable.List(MembershipInput)),
}

type InviteErrorCodes =
	| 'PROJECT_NOT_FOUND'
	| 'ALREADY_MEMBER'
	| 'INVALID_MEMBERSHIP'

export const useInvite = () => useSingleTenantMutation<{ person: { id: string, identity: { id: string } } }, InviteErrorCodes, typeof inviteVariables>(INVITE_MUTATION, inviteVariables)
