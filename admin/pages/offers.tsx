import * as React from 'react'
import { useCurrentRequest, useAuthedContentQuery, useIdentity } from '@contember/admin'
import { OffersGrid, QuestionQueryResult } from '../components/OffersGrid'

const LIST_QUESTION_QUERY = `
	query ($id: UUID!) {
		listQuestion(filter: { offerType: { id: { eq: $id } } }) {
			id
			label
			type
			options {
				label
				value
			}
		}
	}
`

export default () => {
	const id = useCurrentRequest()!.parameters.id as string
	const name = useCurrentRequest()!.parameters.name as string
	const personId = useIdentity().personId
	const { state: query } = useAuthedContentQuery<QuestionQueryResult, { id: string }>(LIST_QUESTION_QUERY, { id })

	if (query.state !== 'success') {
		return <></>
	} else {
		return <OffersGrid query={query} offerTypeId={id} offerTypeName={name} personId={personId} />
	}
}
