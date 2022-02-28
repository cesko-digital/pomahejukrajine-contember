import {
	Checkbox,
	Component,
	DateTimeInput,
	Entity,
	EntityAccessor,
	EntityView,
	Field,
	FieldContainer,
	HasMany,
	Radio,
	SelectField,
	TextInput,
	useEntityList
} from "@contember/admin";
import {Conditional} from "./Conditional";
import * as React from "react";

export const OfferForm = Component(
	() => {
		const parameters = useEntityList('parameters')

		const setParameter = (question: EntityAccessor, value: string, field: 'value' | 'specification' = 'value') => {
			const parameter = Array.from(parameters).find(parameter => parameter.getEntity('question').idOnServer === question.idOnServer)
			if (parameter) {
				parameter.getField<string>(field).updateValue(value)
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


		const setParameters = (question: EntityAccessor, value: string[]) => {
			const parameter = Array.from(parameters).find(parameter => parameter.getEntity('question').idOnServer === question.idOnServer)
			const optionsList = parameter?.getEntityList('options');
			const options = Array.from(optionsList ?? []);
			const staying = options.filter(option => value.includes(option.getField<string>('value').value ?? ''))
			const remove = options.filter(option => !value.includes(option.getField<string>('value').value ?? ''))
			const add = value.filter(value => !options.find(option => option.getField<string>('value').value === value))
			for (const option of remove) {
				option.deleteEntity()
			}
			for (const value of add) {
				optionsList?.createNewEntity((getAccessor) => {
					getAccessor().getField('value').updateValue(value)
				})
			}
		}

		const toggleParameter = (question: EntityAccessor, value: string, add: boolean) => {
			const updateParameter = (parameter: EntityAccessor) => {
				const valuesEntityList = parameter.getEntityList('values');
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

		const setParametersSpecification = (question: EntityAccessor, value: string, specification: string) => {
			const parameter = Array.from(parameters).find(parameter => parameter.getEntity('question').idOnServer === question.idOnServer)
			const option = Array.from(parameter?.getEntityList('values') ?? []).find(option => option.getField<string>('value').value === value)
			option?.getField<string>('specification').updateValue(specification)
		}


		return (
			<>
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
									<Field field="requireSpecification" />
								</HasMany>
							</HasMany>
						</>
					)}
				/>
				<Conditional showIf={acc => acc.getEntity('type').existsOnServer}>
					<HasMany field="type.questions" orderBy="order">
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
										<TextInput value={getParameter(entity)} onChange={e => setParameter(entity, e.target.value)} />
									)}
								/>
							</Conditional>

							<Conditional showIf={acc => acc.getField('type').value === 'textarea'}>
								<EntityView
									render={(entity) => (
										<TextInput allowNewlines value={getParameter(entity)}
															 onChange={e => setParameter(entity, e.target.value)} />
									)}
								/>
							</Conditional>

							<Conditional showIf={acc => acc.getField('type').value === 'date'}>
								<EntityView
									render={(entity) => (
										<DateTimeInput type="date" value={getParameter(entity)}
																	 onChange={value => setParameter(entity, value ?? '')} />
									)}
								/>
							</Conditional>

							<Conditional showIf={acc => acc.getField('type').value === 'number'}>
								<EntityView
									render={(entity) => (
										<TextInput type="number" value={getParameter(entity)}
															 onChange={e => setParameter(entity, e.target.value)} />
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
								<EntityView
									render={(questionEntity) => (
										Array.from(questionEntity.getEntityList('options')).map(optionEntity => {
											const value = optionEntity.getField<string>('value').value!;
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
														<TextInput
															value={getParametersSpecification(questionEntity, value)}
															onChange={e => setParametersSpecification(questionEntity, value, e.target.value)}
														/>
													)}
												</Entity>
											);
										})
									)}
								/>
							</Conditional>

							<Conditional showIf={acc => acc.getField('type').value === 'district'}>
								<EntityView
									render={(entity) => (
										<>
											{getParameterValues(entity)}
										</>
									)}
								/>
							</Conditional>
						</FieldContainer>
					</HasMany>
				</Conditional>
			</>
		);
	},
	() => (
		<>
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
				<Field field="specification" />
				<HasMany field="values">
					<Field field="value" />
					<Field field="specification" />
				</HasMany>
			</HasMany>
		</>
	),
	'OfferForm',
)
