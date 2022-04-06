import * as React from 'react'
import { Button, Component, Field, HasMany, useAuthedContentMutation, useEntity, useEnvironment, useIdentity, useRedirect } from '@contember/admin'

export const OfferManage = Component(
	() => {
		const offer = useEntity()
		const assignees = offer.getEntityList('assignees')
		const identity = useIdentity()
		const env = useEnvironment()
		const [assignSelf] = useAuthedContentMutation<{
			ok: boolean
			errorMessage?: string
		}, { personId: string, offerId: string }>(`
mutation($offerId: UUID!, $personId: UUID!) {
	updateOffer(by: {id: $offerId}, data: {assignees: {connect: {personId: $personId}}}) {
		ok
		errorMessage
	}
}
`)
		const redirect = useRedirect()
		const assign = React.useCallback(async () => {
			await assignSelf({ personId: identity.personId, offerId: offer.id })
			redirect('editOffer(id: $entity.id)')
		}, [assignSelf, redirect])

		const [unassignSelf] = useAuthedContentMutation<{
			ok: boolean
			errorMessage?: string
		}, { offerId: string, personId: string }>(`
mutation($offerId: UUID!, $personId: UUID!) {
	updateOffer(by: {id: $offerId}, data: {assignees: {disconnect: {personId: $personId}}}) {
		ok
		errorMessage
	}
}
`)
		const unassign = React.useCallback(async () => {
			await unassignSelf({ personId: identity.personId, offerId: offer.id })
			redirect('editOffer(id: $entity.id)')
		}, [assignSelf, redirect])

		const assignedPersonIds = Array.from(assignees).map(it => it.getField('personId').value)
		const assignedPersonNames = Array.from(assignees).map(it => it.getField('name').value)

		return (
			<>
				<p>Přiřazen: {assignedPersonNames.length > 0 ? assignedPersonNames.join(', ') : 'nikdo'}</p>
				{assignedPersonIds.includes(identity.personId)
					? <Button onClick={unassign}>Odebrat sebe</Button>
					: <Button onClick={assign}>Přiřadit se k nabídce</Button>
				}
			</>
		)
	}, () => (
		<HasMany field={'assignees'}>
			<Field field={'personId'} />
			<Field field={'name'} />
		</HasMany>
	),
	'OfferManage',
)
