import * as React from 'react'
import {
	BooleanCell,
	BooleanFieldView, Checkbox,
	CheckboxField,
	Component,
	CreatePage,
	DataGrid,
	DataGridPage,
	DateCell, DateTimeInput,
	EditPage, Entity,
	EntityAccessor,
	EntityView,
	Field,
	FieldContainer,
	GenericCell,
	HasMany,
	HasManySelectCell,
	HiddenField,
	LinkButton,
	MultiSelectField, Radio,
	Repeater,
	SelectField,
	Stack,
	TextAreaField,
	TextCell,
	TextField,
	TextInput,
	useEntityList,
} from '@contember/admin'
import {Conditional} from "../components/Conditional";
import {HasManyCell} from "../components/HasManyCell";
import {Language} from "../../api/model";

export const volunteers = (
	<DataGridPage entities="Volunteer[verified=true][banned=false]" itemsPerPage={100} rendererProps={{ title: "Dobrovolníci" }}>
		<TextCell field="email" header="Email" />
		<TextCell field="phone" header="Telefon" />
		<TextCell field="expertise" header="Odbornost" />
		<HasManyCell field="districts" entityList="District" hasOneField="district" header="Okresy">
			<Field field="name" />
		</HasManyCell>
		<HasManySelectCell field="tags" options="VolunteerTag.name" header="Tagy" />
		<TextCell field="userNote" header="Poznámka uživatele" hidden />
		<TextCell field="internalNote" header="Interní poznámka" hidden />
		<DateCell field="createdAt" header="Datum registrace" hidden />
		<BooleanCell field="createdInAdmin" header="Registrován administrátorem" hidden />
		<GenericCell canBeHidden={false} shrunk>
			<LinkButton to="editVolunteer(id: $entity.id)">Detail</LinkButton>
		</GenericCell>
	</DataGridPage>
)

export const offers = (
	<EditPage entity="OfferType(id=$id)" rendererProps={{
		title: <>Nabídky <Field field="name" /></>,
	}}>
		{/*<TitleBar title="Typ nabídky" />*/}
		<DataGrid entities="Offer[type.id=$id][volunteer.verified=true][volunteer.banned=false]" itemsPerPage={100}>
			<BooleanCell field="exhausted" header="Vyčerpáno" />
			{/* TODO: Show only if relevant */}
			<TextCell field="capacity" header="Kapacita" />
			{/* TODO: Show "correct" label */}
			<TextCell field="userNote" header="Poznámka uživatele" />
			<TextCell field="internalNote" header="Interní poznámka" />
			<TextCell field="volunteer.email" header="Dobrovolník: Email" hidden />
			<TextCell field="volunteer.phone" header="Dobrovolník: Telefon" hidden />
			<TextCell field="volunteer.expertise" header="Dobrovolník: Odbornost" hidden />
			<HasManyCell field="volunteer.districts" entityList="District" hasOneField="district" header="Dobrovolník: Okresy">
				<Field field="name" />
			</HasManyCell>
			<HasManySelectCell field="volunteer.tags" options="VolunteerTag.name" header="Dobrovolník: Tagy" />
			<TextCell field="volunteer.userNote" header="Dobrovolník: Poznámka uživatele" hidden />
			<TextCell field="volunteer.internalNote" header="Dobrovolník: Interní poznámka" hidden />
			<DateCell field="volunteer.createdAt" header="Dobrovolník: Datum registrace" hidden />
			<BooleanCell field="volunteer.createdInAdmin" header="Dobrovolník: Registrován administrátorem" hidden />
			<GenericCell canBeHidden={false} shrunk>
				<LinkButton to="editVolunteer(id: $entity.volunteer.id)">Dobrovolník</LinkButton>
			</GenericCell>
		</DataGrid>
	</EditPage>

)

const OfferForm = Component(
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
										<TextInput allowNewlines value={getParameter(entity)} onChange={e => setParameter(entity, e.target.value)} />
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

							<Conditional showIf={acc => acc.getField('type').value === 'number'}>
								<EntityView
									render={(entity) => (
										<TextInput type="number" value={getParameter(entity)} onChange={e => setParameter(entity, e.target.value)} />
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
										// <HasMany field="options">
										// 	<EntityView render={(optionEntity) => {
										// 		const value = optionEntity.getField<string>('value').value!;
										// 		return (
										// 			<>
										// 				<Checkbox
										// 					value={getParameters(questionEntity, value)}
										// 					onChange={checked => {
										// 						toggleParameter(questionEntity, value, checked)
										// 					}}
										// 				>
										// 					<Field field="label" />
										// 				</Checkbox>
										// 				{optionEntity.getField<boolean>('requireSpecification').value && (
										// 					<TextInput
										// 						value={getParametersSpecification(questionEntity, value)}
										// 						onChange={e => setParametersSpecification(questionEntity, value, e.target.value)}
										// 					/>
										// 				)}
										// 			</>
										// 		);
										// 	}} />
										// </HasMany>
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

const VolunteerForm = Component(
	() => (
		<>
			<MultiSelectField label="Tagy" field="tags" options="VolunteerTag.name" />
			<hr />
			<h3>Údaje o uživateli</h3>
			<TextField field="name" label="Jméno" />
			<TextField field="organization" label="Organizace" />
			<TextField field="contactHours" label="Můžete mne kontaktovat (čas)" />
			<TextField field="email" label="Email" />
			<TextField field="phone" label="Telefon" />
			<TextField field="expertise" label="Odbornost" />
			<Repeater field="languages" label="Jazyky" orderBy={undefined}>
				<SelectField label={undefined} options="Language.name" field="language" />
			</Repeater>
			<Repeater field="districts" label="Okresy" orderBy={undefined}>
				<SelectField label={undefined} options="District.name" field="district" />
			</Repeater>
			<TextAreaField field="userNote" label="Poznámka uživatele" />
			<TextAreaField field="internalNote" label="Interní poznámka" />
			<CheckboxField field="verified" label="Ověřený" defaultValue={false} />
			<hr />
			<h3>Co nabízí</h3>
			<Repeater field="offers" label="Nabídky" orderBy="type.order">
				<OfferForm />
			</Repeater>
		</>
	),
	'VolunteerForm',
)

export const newVolunteer = (
	<CreatePage entity="Volunteer" rendererProps={{ title: "Registrovat dobrovolníka" }} redirectOnSuccess="index">
		<HiddenField label={undefined} field="createdInAdmin" defaultValue={true} />
		<VolunteerForm />
	</CreatePage>
)

export const editVolunteer = (
	<EditPage entity="Volunteer(id=$id)" rendererProps={{ title: "Dobrovolník" }}>
		<VolunteerForm />
		<CheckboxField field="banned" label="Zablokován" defaultValue={false} />
		<FieldContainer label="Registrován administrátorem" useLabelElement={false}>
			<BooleanFieldView field="createdInAdmin" />
		</FieldContainer>
	</EditPage>
)
