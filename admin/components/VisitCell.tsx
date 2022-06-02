import * as React from 'react'
import { Component, EntityListSubTree, Field, FieldView, HasMany, useEntityList, useEntityListSubTree } from '@contember/admin'
import './visitCell.sass'

export type VisitCellProps = {
	personId: string
}

export const VisitCell = Component<VisitCellProps>(
	({ personId }) => {
		const visits = useEntityListSubTree('offerVisit')
		const id = useEntityList({ field: `visits[organizationManager.personId = '${personId}']`, limit: 1 })
		const isLast = Array.from(visits)[0]?.id === Array.from(id)[0]?.id

		return (
			<HasMany field={`visits[organizationManager.personId = '${personId}']`} limit={1}>
				<FieldView<string> field="stamp" render={(accessor) => {
					const today = new Date()
					const visitDate = new Date(accessor.value!)
					const diff = today.getTime() - visitDate.getTime()
					const opacity = Math.E ** (-diff / 1000000)

					return <span className={`visit-marker ${isLast ? 'is-last' : ''}`} style={{ opacity: isLast ? 1 : opacity }} title={`před ${Math.ceil(diff / 1000 / 60)} min.`} />
				}} />
			</HasMany>
		)
	},
	({ personId }) => (
		<>
			<EntityListSubTree entities="OfferVisit" alias="offerVisit" orderBy="stamp desc" limit={1} />
			<HasMany field={`visits[organizationManager.personId = '${personId}']`} limit={1}>
				<Field field="stamp" />
			</HasMany>
		</>
	),
	'VisitCell',
)
