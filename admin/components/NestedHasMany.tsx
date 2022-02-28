import { Component, EntityAccessor, EntityListAccessor, HasMany, SugaredRelativeEntityList } from '@contember/admin'
import React from 'react'
import { ComponentType } from 'react'

type NestedHasManyProps = {
	children?: React.ReactNode
	fields: (SugaredRelativeEntityList | string)[]
	listComponent?: ComponentType<{ entities: EntityAccessor[] }>
}

const extractEntities = (accessor: EntityListAccessor, fields: (SugaredRelativeEntityList | string)[]) => {
	if (fields.length === 0) {
		return Array.from(accessor)
	}
	const [field, ...other] = fields
	const accessors: EntityAccessor[] = []
	for (const entity of Array.from(accessor)) {
		accessors.push(...extractEntities(entity.getEntityList(field), other))
	}
	return accessors
}

export const NestedHasMany = Component((props: NestedHasManyProps) => {
	let result: React.ReactElement = <>{props.children}</>
	for (let i = props.fields.length - 1; i >= 0; i--) {
		const field = props.fields[i]
		const hasManyProps: SugaredRelativeEntityList = typeof field === 'string' ? { field } : field
		result = (
			<HasMany
				{...hasManyProps}
				{...(i === 0 && props.listComponent
					? {
						listComponent: ({ accessor }) => {
							const [, ...other] = props.fields
							const entities = extractEntities(accessor, other)
							return React.createElement(props.listComponent!, { entities })
						},
					}
					: {})}
			>
				{result}
			</HasMany>
		)
	}

	return result
})
