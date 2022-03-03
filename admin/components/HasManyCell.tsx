import {
	Button,
	Component,
	Entity,
	EntityListSubTree,
	HasMany,
	HasOne,
	QueryLanguage,
	StaticRender,
	SugaredRelativeEntityList, useEntityListSubTree,
	wrapFilterInHasOnes,
} from '@contember/admin'
import * as React from 'react'
import { Checkbox } from '@contember/admin'
import { DataGridCellPublicProps, DataGridColumn, DataGridHeaderCellPublicProps } from '@contember/admin'

export type HasManyCellProps = DataGridHeaderCellPublicProps &
	DataGridCellPublicProps &
	SugaredRelativeEntityList & {
	children: React.ReactNode
	entityList: string
	separator?: React.ReactNode
	hasOneField?: string
}

type HasManyCellFilterState = {
	ids: string[]
	combinator: 'or' | 'and'
}

interface HasManyCellFilter {
	setFilter: (_: HasManyCellFilterState) => void
	filter: HasManyCellFilterState
	entities: string
	children: React.ReactNode
}

const HasManyCellFilter = React.memo<HasManyCellFilter>(({ setFilter, filter, entities, children }: HasManyCellFilter) => {
	const list = useEntityListSubTree(React.useMemo(() => ({ entities }), [entities]))

	const onCombinatorChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		setFilter({ ...filter, combinator: e.currentTarget.value as HasManyCellFilterState['combinator'] })
	}, [setFilter, filter])

	const ids = Array.isArray(filter.ids) ? new Set(filter.ids) : filter.ids
	console.log(ids)

	return  <>
		<div style={{ marginBottom: '.7em', display: 'flex', gap: '1em' }}>
			<label><input type="radio" name="combinator" value="or" checked={filter.combinator === "or"} onChange={onCombinatorChange} /> Kteréholiv z vybraných</label>
			<label><input type="radio" name="combinator" value="and" checked={filter.combinator === "and"} onChange={onCombinatorChange} /> Všechny vybrané</label>
		</div>

		<div style={{ marginBottom: '.7em', display: 'flex', gap: '1em' }}>
			<Button size="small" onClick={() => setFilter({ ...filter, ids: Array.from(list).filter(it => it.existsOnServer).map(it => it.id!) })}>Vybrat všechny</Button>
			<Button size="small" onClick={() => setFilter({ ...filter, ids: [] })}>Vybrat žádné</Button>
		</div>

		<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.5em' }}>
			{Array.from(list).filter(it => it.existsOnServer).map(accessor => {
				return <Checkbox
					key={accessor.key}
					value={ids?.has(accessor.id!) ?? false}
					onChange={checked => {
						const newSet = new Set(ids)
						if (checked) {
							newSet.add(accessor.id!)
						} else {
							newSet.delete(accessor.id!)
						}
						setFilter({ ...filter, ids: Array.from(newSet) })
					}}
				>
					<Entity accessor={accessor}>
						{children}
					</Entity>
				</Checkbox>
			})}
		</div>
	</>

})

export const HasManyCell = Component<HasManyCellProps>(
	props => {
		return (
			<DataGridColumn<HasManyCellFilterState>
				{...props}
				enableOrdering={false}
				getNewFilter={(filter, { environment }) => {
					console.log(filter)

					if (filter === undefined || !('ids' in filter) || filter.ids.length === 0) {
						return undefined
					}

					const desugared = QueryLanguage.desugarRelativeEntityList(props, environment)
					return wrapFilterInHasOnes(desugared.hasOneRelationPath, {
						[filter.combinator]: Array.from(filter.ids).map(id => ({
							[desugared.hasManyRelation.field]: (
								props.hasOneField
									? { [props.hasOneField]: { id: { eq: id } } }
									: { id: { eq: id } }
							)
						})),
					})
				}}
				emptyFilter={{ combinator: 'or', ids: [] }}
				enableFiltering={true}
				initialFilter={undefined}
				filterRenderer={({ filter, setFilter }) => {
					return <HasManyCellFilter filter={filter} setFilter={setFilter} entities={props.entityList} children={props.children} />
				}}
			>
				<HasMany field={props.field} listComponent={({ accessor }) => {
					if (accessor.length === 0) {
						return null
					}
					const res = []
					for (const entity of accessor) {
						if (res.length > 0) {
							res.push(props.separator === undefined ? <>, </> : props.separator)
						}
						res.push(
							<Entity key={entity.key} accessor={entity}>
								{props.hasOneField ? <HasOne field={props.hasOneField}>
									{props.children}
								</HasOne> : props.children}
							</Entity>
						)
					}
					return <>{res}</>
				}}>
					{props.hasOneField && <HasOne field={props.hasOneField}>
						{props.children}
					</HasOne>}
				</HasMany>

				<StaticRender>
					<EntityListSubTree entities={props.entityList}>
						{props.children}
					</EntityListSubTree>
				</StaticRender>
			</DataGridColumn>
		)
	},
	'HasManyCell',
) as (props: HasManyCellProps) => React.ReactElement
