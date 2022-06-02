import * as React from 'react'
import { Component, useCurrentContentGraphQlClient, useField, useIdentity } from '@contember/admin'

export const VisitMarker = Component(
	() => {
		const offerId = useField('id').value
		const idenity = useIdentity()
		const client = useCurrentContentGraphQlClient()

		React.useEffect(
			() => {
				client.sendRequest(`
					mutation ($offerId: UUID!, $personId: UUID!) {
						createOfferVisit(
							data: {
								offer: { connect: { id: $offerId } }
								organizationManager: { connect: { personId: $personId } }
							}
						) {
							ok
						}
					}
				`,
					{ variables: { personId: idenity.personId, offerId } },
				)
			},
			[idenity, offerId]
		)

		return null
	},
	() => null,
	'VisitMarker',
)
