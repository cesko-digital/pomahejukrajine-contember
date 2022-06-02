import * as React from 'react'
import { BooleanCell, Component, ControlledDataGrid, DataBindingProvider, DateCell, EntityListSubTree, FeedbackRenderer, Field, FieldView, GenericCell, GenericPage, HasMany, HasManySelectCell, HasOneSelectCell, LinkButton, NumberCell, RichTextField, TextCell, useDataGrid, useEntity, useEntityList, useEntityListSubTree, useField } from '@contember/admin'
import { limitLength } from '../utils/limitLength'
import { ExportOffers } from './ExportOffers'
import { HasManyCell } from './HasManyCell'
import { HasManyFilterCell } from './HasManyFilterCell'
import { RoleConditional } from './RoleConditional'
import { VisitCell } from './VisitCell'

export type QuestionQueryResult = {
	listQuestion: { id: string; label: string, type: string, options: { label: string, value: string }[] }[]
}

function parseJSON(json: string) {
	try {
		var parsedText = ''
		var parsedJSON = JSON.parse(json)
		for (var text in parsedJSON.children) {
			parsedText += parsedJSON.children[text].text ? parsedJSON.children[text].text : ''
		}
		return parsedText
	} catch (e) {
		return null
	}
}

const SpecificationValue = ({ entity }: any) => {
	const specification = entity.getField('specification').value
	if (specification && specification.length > 30) {
		return (
			<span style={{ fontSize: '90%' }}>({specification.substr(0, 30) + '…'})</span>
		)
	} else if (specification) {
		return (
			<span style={{ fontSize: '90%' }}>({specification})</span>
		)
	}
	return null
}

export const OffersGrid = (
	({ query, offerTypeId, offerTypeName, personId }: { query: { data: QuestionQueryResult }, offerTypeId: string, offerTypeName: string, personId: string }) => {
		const dataGridProps = useDataGrid({
			entities: 'Offer[type.id=$id][isDeleted=false][volunteer.verified=true][volunteer.banned=false]',
			itemsPerPage: 20,
			children: React.useMemo(
				() => (
					<>
						<GenericCell shrunk>
							<VisitCell personId={personId} />
						</GenericCell>
						<GenericCell canBeHidden={false} shrunk>
							<LinkButton to="editOffer(id: $entity.id)">Otevřít</LinkButton>
						</GenericCell>
						<TextCell field="code" header="Kód" />
						<DateCell field="createdAt" header="Vytvořeno" />
						<HasManySelectCell field="assignees" header="Přiřazen" options={'OrganizationManager.name'} renderElements={els => <span>{els.map(el => <span style={{ display: 'block', fontSize: '90%' }}>{el}</span>)}</span>} />
						{/* <GenericCell header="Prohlíží" shrunk>
					<CurrentEntityKeyListener>
						{(data) => (<CollaborationList emails={data?.keys?.map(key => key.client.email) ?? []} />)}
					</CurrentEntityKeyListener>
				</GenericCell> */}
						<HasOneSelectCell field="status" options="OfferStatus.name" header="Status" />
						<HasManyCell field="volunteer.languages" entityList="Language" hasOneField="language"
							header="Dobrovolník: Jazyky">
							<Field field="name" />
						</HasManyCell>
						{
							query.data.listQuestion.map(question => {
								if (["text", "radio", "textarea", "date"].includes(question.type)) {
									return (
										<TextCell
											key={question.id}
											field={`parameters(question.id='${question.id}').value`}
											header={question.label}
											hidden={question.type === "textarea"}
											format={limitLength(30, true)}
											disableOrder
										/>
									)
								} else if (question.type === "number") {
									return (
										<NumberCell
											key={question.id}
											field={`details.numericValue`}
											header={question.label}
										/>
									)
								} else if (["checkbox"].includes(question.type)) {
									return (
										<HasManyFilterCell
											key={question.id}
											field={`parameters(question.id='${question.id}').values`}
											header={question.label}
											createWhere={(query) => ({
												value: query,
											})}
											render={({ entities }) => (
												<>
													{entities.map((entity) => (
														<React.Fragment key={entity.key}>
															{entity.getField('value').value}
															{' '}<SpecificationValue entity={entity} />
															<br />
														</React.Fragment>
													))}
												</>
											)}
										>
											<Field field={`value`} />
											<Field field={`specification`} />
										</HasManyFilterCell>
									)
								} else if (["district"].includes(question.type)) {
									return (
										<>
											<HasManyFilterCell
												key={question.id}
												field={`parameters(question.id='${question.id}').values`}
												header={question.label}
												createWhere={(query) => ({
													district: { name: query },
												})}
												render={({ entities }) => (
													<>
														{entities.map((entity) => (
															<React.Fragment key={entity.key}>
																{entity.getField('district.name').value}
																<br />
															</React.Fragment>
														))}
													</>
												)}
											>
												<Field field={`district.name`} />
											</HasManyFilterCell>
											<HasManyCell
												key={question.id}
												field={`parameters(question.id='${question.id}').values`}
												header={question.label === 'Okres' ? 'Kraj' : `${question.label} - Kraj`}
												entityList="Region"
												hasOneField="district.region"
												separator=""
											>
												<Field field={`name`} /><br />
											</HasManyCell>
										</>
									)
								} else {
									return null
								}
							}).filter(item => item !== null)
						}
						<GenericCell header="Interní poznámka" hidden>
							<FieldView field="internalNote" render={(accessor) => <span style={{ width: '300px', display: 'block', whiteSpace: 'normal', fontSize: '12px' }}>{parseJSON(accessor.value as string)}</span>} />
						</GenericCell>
						<TextCell field="volunteer.email" header="Dobrovolník: Email" hidden />
						<TextCell field="volunteer.phone" header="Dobrovolník: Telefon" hidden />
						<TextCell field="volunteer.expertise" header="Dobrovolník: Odbornost" hidden format={limitLength(30, true)} />
						<HasManySelectCell field="volunteer.tags" options="VolunteerTag.name" header="Dobrovolník: Tagy" />
						<TextCell field="volunteer.userNote" header="Dobrovolník: Poznámka uživatele" hidden
							format={limitLength(30, true)} />
						<TextCell field="volunteer.internalNote" header="Dobrovolník: Interní poznámka" hidden
							format={limitLength(30, true)} />
						<DateCell field="volunteer.createdAt" header="Dobrovolník: Datum registrace" hidden />
						<BooleanCell field="volunteer.createdInAdmin" header="Dobrovolník: Registrován administrátorem" hidden />
						{/*<GenericCell canBeHidden={false} shrunk>*/}
						{/*	<LinkButton to="editVolunteer(id: $entity.volunteer.id)">Dobrovolník</LinkButton>*/}
						{/*</GenericCell>*/}
					</>
				),
				[],
			),
		})

		return (
			<GenericPage title={offerTypeName} actions={
				<>
					<LinkButton to={`offersSearch(id:'${offerTypeId}')`} distinction="outlined">Hledat</LinkButton>
					<RoleConditional role={['admin', 'organizationAdmin']}>
						<ExportOffers dataGridProps={dataGridProps} listQuestion={query.data.listQuestion} />
					</RoleConditional>
				</>
			}>
				<DataBindingProvider stateComponent={FeedbackRenderer} refreshOnEnvironmentChange={false}>
					<div className='data-grid-container'>
						<ControlledDataGrid {...dataGridProps} />
					</div>
				</DataBindingProvider>
			</GenericPage>
		)
	}
)
