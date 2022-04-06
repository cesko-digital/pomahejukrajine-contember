import { useProjectSlug, useShowToast, EntityAccessor } from '@contember/admin'
import { useCallback } from 'react'
import { useInvite } from './useInvite'

export const useInviteManager = () => {
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
