import {
	Checkbox,
	Component, DateFieldView,
	DateTimeInput,
	Entity,
	EntityAccessor,
	EntityListSubTree,
	EntityView,
	Field,
	FieldContainer,
	HasMany,
	Radio,
	SelectField,
	Stack,
	TextInput,
	useEntityList,
	Repeater,
	Section,
	TextAreaField,
	useIdentity,
	useEntityBeforePersist,
	FieldView,
	HasOne,
	useEntityListSubTree,
	EntitySubTree,
	TextField,
} from "@contember/admin"
import { Conditional } from "./Conditional"
import * as React from "react"
import Select, { SelectInstance } from 'react-select'
import offers from "../pages/offers"

type OfferParametersFormProps = {
	currentType?: boolean
}

type CurrentTypeProps = {
	currentType?: boolean
	children: React.ReactNode
}


const CurrentType = Component<CurrentTypeProps>(
	props => {
		if (props.currentType) {
			return (
				<EntitySubTree entity={`OfferType(offers.id = $id)`}>
					<HasMany field="questions" orderBy="order">
						{props.children}
					</HasMany>
				</EntitySubTree>
			)
		}
		return (
			<HasMany field="type.questions" orderBy="order">
				{props.children}
			</HasMany>
		)
	},
	'CurrentType',
)

export const OfferParametersForm = Component<OfferParametersFormProps>(
	({ currentType }) => {
		const parameters = useEntityList('parameters')
		const districts = useEntityListSubTree('districts')

		const setParameter = (question: EntityAccessor, value: string | number, field: 'value' | 'specification' | 'numericValue' = 'value') => {
			const parameter = Array.from(parameters).find(parameter => parameter.getEntity('question').idOnServer === question.idOnServer)
			if (parameter) {
				parameter.getField<string | number>(field).updateValue(value)
			} else {
				parameters.createNewEntity((getAccessor) => {
					getAccessor().connectEntityAtField('question', question)
					getAccessor().getField(field).updateValue(value)
				})
			}
		}
		const setUKParameter = (question: EntityAccessor, value: string | number, field: 'valueUK' | 'specification' | 'numericValue' = 'valueUK') => {
			const parameter = Array.from(parameters).find(parameter => parameter.getEntity('question').idOnServer === question.idOnServer)
			if (parameter) {
				parameter.getField<string | number>(field).updateValue(value)
			} else {
				parameters.createNewEntity((getAccessor) => {
					getAccessor().connectEntityAtField('question', question)
					getAccessor().getField(field).updateValue(value)
				})
			}
		}

		const getParameter = (question: EntityAccessor, field: 'value' | 'specification' = 'value'): string => {
			const parameter = Array.from(parameters).find(parameter => parameter.getEntity('question').idOnServer === question.idOnServer)
			return parameter?.getField<string>(field).value ?? ''
		}

		const getUKParameter = (question: EntityAccessor, field: 'valueUK' | 'specification' = 'valueUK'): string => {
			const parameter = Array.from(parameters).find(parameter => parameter.getEntity('question').idOnServer === question.idOnServer)
			return parameter?.getField<string>(field).value ?? ''
		}

		const setParameters = (question: EntityAccessor, value: string[]) => {
			let parameter = Array.from(parameters).find(parameter => parameter.getEntity('question').idOnServer === question.idOnServer)
			if (!parameter) {
				parameters.createNewEntity((getAccessor) => {
					getAccessor().connectEntityAtField('question', question)

					parameter = getAccessor()
				})
			}
			const optionsList = parameter?.getEntityList('values')
			const options = Array.from(optionsList ?? [])
			const staying = options.filter(option => value.includes(option.getField<string>('value').value ?? ''))
			const remove = options.filter(option => !value.includes(option.getField<string>('value').value ?? ''))
			const add = value.filter(value => !options.find(option => option.getField<string>('value').value === value))
			for (const option of remove) {
				option.deleteEntity()
			}
			for (const value of add) {
				optionsList?.createNewEntity((getAccessor) => {
					getAccessor().getField('value').updateValue(value)
					getAccessor().connectEntityAtField('district', Array.from(districts).find(district => district.getField<string>('name').value === value)!)
				})
			}
		}

		const toggleParameter = (question: EntityAccessor, value: string, add: boolean) => {
			const updateParameter = (parameter: EntityAccessor) => {
				const valuesEntityList = parameter.getEntityList('values')
				const currentOptions = Array.from(valuesEntityList ?? []).map(option => option.getField<string>('value').value!)
				if (add) {
					if (!currentOptions.includes(value)) {
						valuesEntityList?.createNewEntity((getAccessor) => {
							getAccessor().getField('value').updateValue(value)
						})
					}
				} else {
					if (currentOptions.includes(value)) {
						const option = Array.from(valuesEntityList ?? []).find(option => option.getField<string>('value').value === value)
						option?.deleteEntity()
					}
				}
			}
			const parameter = Array.from(parameters).find(parameter => parameter.getEntity('question').idOnServer === question.idOnServer)
			if (parameter !== undefined) {
				updateParameter(parameter)
			} else {
				parameters.createNewEntity((getAccessor) => {
					getAccessor().connectEntityAtField('question', question)
					updateParameter(getAccessor())
				})
			}
		}


		const getParameterValues = (question: EntityAccessor): string[] => {
			const parameter = Array.from(parameters).find(parameter => parameter.getEntity('question').idOnServer === question.idOnServer)
			return Array.from(parameter?.getEntityList('values') ?? []).map(option => option.getField<string>('value').value!)
		}

		const getParameters = (question: EntityAccessor, value: string): boolean => {
			const parameter = Array.from(parameters).find(parameter => parameter.getEntity('question').idOnServer === question.idOnServer)
			const option = Array.from(parameter?.getEntityList('values') ?? []).find(option => option.getField<string>('value').value === value)
			return option !== undefined
		}

		const getParametersSpecification = (question: EntityAccessor, value: string): string => {
			const parameter = Array.from(parameters).find(parameter => parameter.getEntity('question').idOnServer === question.idOnServer)
			const option = Array.from(parameter?.getEntityList('values') ?? []).find(option => option.getField<string>('value').value === value)
			return option?.getField<string>('specification').value ?? ''
		}

		const getParametersSpecificationUK = (question: EntityAccessor, value: string): string => {
			const parameter = Array.from(parameters).find(parameter => parameter.getEntity('question').idOnServer === question.idOnServer)
			const option = Array.from(parameter?.getEntityList('values') ?? []).find(option => option.getField<string>('value').value === value)
			return option?.getField<string>('specificationUK').value ?? ''
		}

		const setParametersSpecification = (question: EntityAccessor, value: string, specification: string) => {
			const parameter = Array.from(parameters).find(parameter => parameter.getEntity('question').idOnServer === question.idOnServer)
			const option = Array.from(parameter?.getEntityList('values') ?? []).find(option => option.getField<string>('value').value === value)
			option?.getField<string>('specification').updateValue(specification)
		}

		const setParametersSpecificationUK = (question: EntityAccessor, value: string, specification: string) => {
			const parameter = Array.from(parameters).find(parameter => parameter.getEntity('question').idOnServer === question.idOnServer)
			const option = Array.from(parameter?.getEntityList('values') ?? []).find(option => option.getField<string>('value').value === value)
			option?.getField<string>('specificationUK').updateValue(specification)
		}

		return (
			<>
				{!currentType && <SelectField
					label="Typ nabídky"
					field="type"
					options="OfferType"
					renderOption={(option) => {
						const infoText = option.getField<string>('infoText').value
						return option.getField('name').value + (infoText ? ` (${infoText})` : '')
					}}
					optionsStaticRender={(
						<>
							<Field field="name" />
							<Field field="infoText" />
							<HasMany field="questions" orderBy="order">
								<Field field="question" />
								<Field field="required" />
								<Field field="type" />
								<HasMany field="options">
									<Field field="label" />
									<Field field="requireSpecification" />
								</HasMany>
							</HasMany>
						</>
					)}
				/>
				}
				<Conditional showIf={acc => acc.getEntity('type').existsOnServer}>
					<CurrentType currentType={currentType}>
						<FieldContainer
							useLabelElement={false}
							label={(
								<>
									<Field field="question" />
									{' '}
									<Field field="required" format={r => r ? '(povinné)' : '(nepovinné)'} />
								</>
							)}
						>
							<Conditional showIf={acc => acc.getField('type').value === 'text'}>
								<EntityView
									render={(entity) => (
										<>
											<TextInput value={getParameter(entity)} onChange={e => setParameter(entity, e.target.value)} />
											<TextInput value={getUKParameter(entity)} onChange={e => setUKParameter(entity, e.target.value)} />
										</>
									)}
								/>
							</Conditional>

							<Conditional showIf={acc => acc.getField('type').value === 'textarea'}>
								<EntityView
									render={(entity) => (
										<>
											<TextInput allowNewlines value={getParameter(entity)} onChange={e => setParameter(entity, e.target.value)} />
											<TextInput allowNewlines value={getUKParameter(entity)} onChange={e => setUKParameter(entity, e.target.value)} />
										</>
									)}
								/>
							</Conditional>

							<Conditional showIf={acc => acc.getField('type').value === 'date'}>
								<EntityView
									render={(entity) => (
										<DateTimeInput type="date" value={getParameter(entity)} onChange={value => setParameter(entity, value ?? '')} />
									)}
								/>
							</Conditional>

							<Conditional showIf={acc => { console.log(currentType, acc.getField('type').value); return acc.getField('type').value === 'number' }}>
								<EntityView
									render={(entity) => (
										<>
											<TextInput
												type="number"
												value={getParameter(entity)}
												onChange={e => {
													setParameter(entity, e.target.value)
													setParameter(entity, parseInt(e.target.value), 'numericValue')
												}}
											/>
										</>
									)}
								/>
							</Conditional>

							<Conditional showIf={acc => acc.getField('type').value === 'radio'}>
								<EntityView
									render={(entity) => (
										<>
											<Radio
												value={getParameter(entity)}
												options={Array.from(entity.getEntityList('options'), (option) => ({
													label: option.getField<string>('label').value!,
													value: option.getField<string>('value').value!,
												}))}
												onChange={value => setParameter(entity, value)}
											/>
											{
												Array.from(entity.getEntityList('options'))
													.find(it => it.getField<string>('value').value === getParameter(entity))
													?.getField<boolean>('requireSpecification').value!
												&& (
													<TextInput
														value={getParameter(entity, 'specification')}
														onChange={e => setParameter(entity, e.target.value, 'specification')}
													/>
												)}
										</>
									)}
								/>
							</Conditional>


							<Conditional showIf={acc => acc.getField('type').value === 'checkbox'}>
								<Stack direction={"vertical"}>
									<EntityView
										render={(questionEntity) => (
											Array.from(questionEntity.getEntityList('options')).map(optionEntity => {
												const value = optionEntity.getField<string>('value').value!
												return (
													<Entity accessor={optionEntity} key={value}>
														<Checkbox
															value={getParameters(questionEntity, value)}
															onChange={checked => {
																toggleParameter(questionEntity, value, checked)
															}}
														>
															<Field field="label" />
														</Checkbox>
														{optionEntity.getField<boolean>('requireSpecification').value && (
															<>
																<TextInput value={getParametersSpecification(questionEntity, value)} onChange={e => setParametersSpecification(questionEntity, value, e.target.value)} />
																<TextInput value={getParametersSpecificationUK(questionEntity, value)} onChange={e => setParametersSpecificationUK(questionEntity, value, e.target.value)} />
															</>
														)}
													</Entity>
												)
											})
										)}
									/>
								</Stack>
							</Conditional>

							<Conditional showIf={acc => acc.getField('type').value === 'district'}>
								<EntityView
									render={(entity) => {
										const options = Array.from(districts).map(district => ({
											label: district.getField<string>('name').value!,
											value: district.getField<string>('name').value!
										}))

										return (
											<Select
												isMulti
												closeMenuOnSelect={false}
												value={options.filter(it => {
													return getParameterValues(entity).includes(it.value)
												})}
												onChange={(value) => {
													setParameters(entity, value.map(it => it.value))

												}}
												options={options}
											/>
										)
									}}
								/>
							</Conditional>
						</FieldContainer>
					</CurrentType>
				</Conditional>
			</>
		)
	},
	({ currentType }) => (
		<>
			<EntityListSubTree entities="District" alias="districts" >
				<Field field="name" />
			</EntityListSubTree>
			{currentType && (
				<EntitySubTree entity={`OfferType(offers.id = $id)`}>
					<HasMany field="questions" orderBy="order">
						<Field field="question" />
						<Field field="required" />
						<Field field="type" />
						<HasMany field="options">
							<Field field="label" />
							<Field field="value" />
							<Field field="requireSpecification" />
						</HasMany>
					</HasMany>
				</EntitySubTree>
			)}
			<SelectField
				label="Typ nabídky"
				field="type"
				options="OfferType"
				renderOption={(option) => {
					const infoText = option.getField<string>('infoText').value
					return option.getField('name').value + (infoText ? ` (${infoText})` : '')
				}}
				optionsStaticRender={(
					<>
						<Field field="name" />
						<Field field="infoText" />
						<HasMany field="questions" orderBy="order">
							<Field field="question" />
							<Field field="required" />
							<Field field="type" />
							<HasMany field="options">
								<Field field="label" />
								<Field field="value" />
								<Field field="requireSpecification" />
							</HasMany>
						</HasMany>
					</>
				)}
			/>
			<HasMany field="type.questions" orderBy="order">
				<Field field="question" />
				<Field field="required" />
				<Field field="type" />
				<HasMany field="options">
					<Field field="label" />
					<Field field="value" />
					<Field field="requireSpecification" />
				</HasMany>
			</HasMany>
			<HasMany field="parameters">
				<Field field="question.id" />
				<Field field="value" />
				<Field field="valueUK" />
				<Field field="numericValue" />
				<Field field="specification" />
				<Field field="specificationUK" />
				<HasMany field="values">
					<Field field="value" />
					<Field field="valueUK" />
					<Field field="specification" />
					<Field field="specificationUK" />
					<HasOne field="district">
						<Field field="name" />
					</HasOne>
				</HasMany>
			</HasMany>
		</>
	),
	'OfferForm',
)

const dateFormat = new Intl.DateTimeFormat("cs", { timeStyle: "short", dateStyle: "full" })


const LogForm = Component(
	() => {
		const identity = useIdentity()

		useEntityBeforePersist((getEntity, opts) => {
			const managers = opts.getEntityListSubTree({ entities: 'OrganizationManager' })
			const manager = Array.from(managers).find(it => it.getField('personId').value === identity.personId)

			if (manager) {
				for (const entity of getEntity().getEntityList({ field: 'logs', orderBy: 'createdAt' })) {
					if (!entity.existsOnServer && entity.hasUnpersistedChanges) {
						entity.connectEntityAtField('author', manager)
					}
				}
			}
		})

		return (
			<>
				<div>Pokud s nabídkou jakkoli pracujete, zanechte prosím o tom zde v logu zprávu.</div>
				<Repeater label="Log" field="logs" orderBy="createdAt" enableRemoving={false}>
					<Conditional showIf={it => it.existsOnServer}>
						<strong><FieldView field="createdAt" render={date => dateFormat.format(new Date(date.value as string))} />, <Field field="author.name" /> (<Field field="author.organization.name" />)</strong>
						<p style={{ margin: 0 }}><Field field="text" format={it => (it as string)?.split('\n').map(it => <>{it}<br /></>)} /></p>
					</Conditional>
					<Conditional showIf={it => !it.existsOnServer}>
						<TextAreaField field="text" label={undefined} />
					</Conditional>
				</Repeater>
				<div>(Zpráva se neukládá automaticky, uložíte ji tlačítkem Save vpravo nahoře.)</div>
			</>
		)
	},
	() => {
		return (
			<>
				<Repeater label="Log" field="logs" orderBy="createdAt" enableRemoving={false}>
					<Field field="author.name" />
					<Field field="author.organization.name" />
					<Field field="createdAt" />
					<TextAreaField field="text" label={undefined} />
					<Field field="author.id" />
				</Repeater>
				<EntityListSubTree entities="OrganizationManager">
					<Field field="personId" />
					<Field field="name" />
					<Field field="organization.name" />
				</EntityListSubTree>
			</>
		)
	},
)


export const OfferForm = Component(
	() => {
		return (
			<>
				<SelectField label="Stav nabídky" options="OfferStatus.name" field="status" allowNull />
				<FieldContainer label="Datum vložení nabídky">
					<FieldView field="createdAt" render={date => dateFormat.format(new Date(date.value as string))} />
				</FieldContainer>
				<LogForm />
				<Section heading="Nabídka">
					<Stack direction="horizontal">
						<TextField label="Název nabídky" field="name" />
						<TextField label="Název nabídky v Ukrajinštině" field="nameUK" />
					</Stack>
					<OfferParametersForm />
				</Section>
			</>
		)
	},
	'OfferForm',
)
