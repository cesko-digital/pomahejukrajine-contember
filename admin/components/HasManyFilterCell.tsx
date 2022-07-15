import {
	Checkbox,
	Component,
	DataGridCellPublicProps,
	DataGridColumn,
	DataGridHeaderCellPublicProps,
	EntityAccessor,
	FieldContainer,
	FieldFallbackViewPublicProps,
	Filter,
	HasMany,
	Input,
	QueryLanguage,
	Select,
	SugaredRelativeEntityList,
	TextInput,
	wrapFilterInHasOnes
} from '@contember/admin'
import React, { ComponentType, FunctionComponent, ReactNode } from 'react'
import { NestedHasMany } from './NestedHasMany'

export type HasManyFilterCellProps = DataGridHeaderCellPublicProps &
	DataGridCellPublicProps &
	FieldFallbackViewPublicProps &
	(SugaredRelativeEntityList | { fields: (SugaredRelativeEntityList | string)[] }) & {
	render: ComponentType<{ entities: EntityAccessor[] }>
	children: ReactNode
	createWhere?: (condition: Input.Condition<string>, value: string) => Input.Where
	// Boolean field, if false behave as an empty relations
	onlyIfField?: string
}

type TextFilterArtifacts = {
	mode: 'matches' | 'matchesExactly' | 'startsWith' | 'endsWith' | 'doesNotMatch'
	query: string
	onlyHasNone: boolean
}

export const HasManyFilterCell: FunctionComponent<HasManyFilterCellProps> = Component((props) => {
	const children =
		'fields' in props ? (
			<NestedHasMany
				fields={'fields' in props ? props.fields : [props]}
				children={props.children}
				listComponent={props.render}
			/>
		) : (
			<HasMany
				{...props}
				listComponent={({ accessor }) => React.createElement(props.render, { entities: Array.from(accessor) })}
			/>
		)

	return (
		<DataGridColumn<TextFilterArtifacts>
			{...props}
			enableOrdering={false}
			getNewFilter={(filter, { environment }) => {
				if (!props.createWhere) {
					return undefined
				}
				if (filter.onlyHasNone === false) {
					if (filter.query === '') {
						return undefined
					}
					const baseOperators = {
						matches: 'containsCI',
						doesNotMatch: 'containsCI',
						startsWith: 'startsWithCI',
						endsWith: 'endsWithCI',
						matchesExactly: 'eq',
					}

					let condition: Input.Condition<string> = {
						[baseOperators[filter.mode]]: filter.query,
					}

					if (filter.mode === 'doesNotMatch') {
						condition = { not: condition }
					}

					let where: Filter = props.createWhere(condition, filter.query)
					const fields = 'fields' in props ? props.fields : [props]
					for (let i = fields.length - 1; i >= 0; i--) {
						const desugared = QueryLanguage.desugarRelativeEntityList(fields[i], environment)
						where = wrapFilterInHasOnes(desugared.hasOneRelationPath, {
							[desugared.hasManyRelation.field]:
								desugared.hasManyRelation.filter !== undefined
									? { and: [desugared.hasManyRelation.filter, where] }
									: where,
						})
					}

					if (props.onlyIfField) {
						const desugared = QueryLanguage.desugarRelativeSingleField(props.onlyIfField, environment)
						const onlyIfEmptyWhere = wrapFilterInHasOnes(desugared.hasOneRelationPath, {
							[desugared.field]: { eq: true },
						})
						return { and: [where, onlyIfEmptyWhere] }
					} else {
						return where
					}
				} else {
					let where: Filter = { id: { isNull: false } }
					const fields = 'fields' in props ? props.fields : [props]
					for (let i = fields.length - 1; i >= 0; i--) {
						const desugared = QueryLanguage.desugarRelativeEntityList(fields[i], environment)
						where = wrapFilterInHasOnes(desugared.hasOneRelationPath, {
							[desugared.hasManyRelation.field]:
								desugared.hasManyRelation.filter !== undefined
									? { and: [desugared.hasManyRelation.filter, where] }
									: where,
						})
					}
					if (props.onlyIfField) {
						const desugared = QueryLanguage.desugarRelativeSingleField(props.onlyIfField, environment)
						const onlyIfEmptyWhere = wrapFilterInHasOnes(desugared.hasOneRelationPath, {
							[desugared.field]: { eq: false },
						})
						return { or: [{ not: where }, onlyIfEmptyWhere] }
					} else {
						return { not: where }
					}
				}
			}}
			enableFiltering={!!props.createWhere}
			emptyFilter={{
				mode: 'matches',
				query: '',
				onlyHasNone: false,
			}}
			filterRenderer={({ filter, setFilter }) => {
				const options: Array<{
					value: TextFilterArtifacts['mode']
					label: string
				}> = [
					{ value: 'matches', label: 'Obsahuje' },
					{ value: 'doesNotMatch', label: "Neobsahuje" },
					{ value: 'matchesExactly', label: 'Přesná shoda' },
					{ value: 'startsWith', label: 'Začíná na' },
					{ value: 'endsWith', label: 'Končí na' },
				]
				return (
					<>
						<FieldContainer
							label="Zahrnout prázdné"
							labelPosition="labelInlineRight"
						>
							<Checkbox
								notNull
								value={filter.onlyHasNone}
								onChange={(checked) => setFilter({ ...filter, onlyHasNone: !!checked })}
							/>
						</FieldContainer>

						<div style={{ display: 'flex', gap: '0.5em', alignItems: 'center', marginTop: '1em' }}>
							<Select
								notNull
								value={filter.mode}
								options={options}
								onChange={(value) => {
									if (value) {
										setFilter({
											...filter,
											mode: value,
										})
									}
								}}
								disabled={filter.onlyHasNone}
							/>
							<TextInput
								notNull
								value={filter.query}
								placeholder="Query"
								onChange={(value) => {
									setFilter({
										...filter,
										query: value ?? '',
									})
								}}
								disabled={filter.onlyHasNone}
							/>
						</div>
					</>
				)
			}}
		>
			{children}
			{/*{props.onlyIfField ? (*/}
			{/*	<DependentCollapsible field={props.onlyIfField} condition={(field) => !!field}>*/}
			{/*		{children}*/}
			{/*	</DependentCollapsible>*/}
			{/*) : (*/}
			{/*	children*/}
			{/*)}*/}
		</DataGridColumn>
	)
}, 'HasManyFilterCell')
