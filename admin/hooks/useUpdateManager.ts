import { useProjectSlug, useShowToast, EntityAccessor } from '@contember/admin'
import { useCallback } from 'react'
import { useUpdate } from './useUpdate'

export const useUpdateManager = () => {
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
