import * as React from 'react'
import { useDataGrid, FeedbackRenderer, useCurrentRequest, useAuthedContentQuery, BooleanCell, ControlledDataGrid, DataBindingProvider, DateCell, Field, GenericCell, GenericPage, HasManySelectCell, HasOneSelectCell, LinkButton, NumberCell, TextCell } from '@contember/admin'
import { useMemo } from 'react'
import { ExportOffers } from '../components/ExportOffers'
import { HasManyCell } from '../components/HasManyCell'
import { HasManyFilterCell } from '../components/HasManyFilterCell'
import { RoleConditional } from '../components/RoleConditional'

const limitLength = (maxLength: number) => (value: any) => {
	if (typeof value !== 'string') {
		return value
	}
	if (value.length > maxLength) {
		return <span style={{ width: '300px', display: 'block', whiteSpace: 'normal', fontSize: '12px' }} title={value}>{value}</span>
	}
	return value
}

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

export type QuestionQueryResult = {
	listQuestion: { id: string; label: string, type: string, options: { label: string, value: string }[] }[]
}

const OffersGrid = (
	({ query }: { query: { data: QuestionQueryResult } }) => {
		const dataGridProps = useDataGrid({
			entities: 'Offer[type.id=$id][volunteer.verified=true][volunteer.banned=false]',
			itemsPerPage: 20,
			children: useMemo(() => <>
				<GenericCell canBeHidden={false} shrunk>
					<LinkButton to="editOffer(id: $entity.id)">Otevřít</LinkButton>
				</GenericCell>
				<TextCell field="code" header="Kód" />
				<HasManySelectCell field="assignees" header="Přiřazen" options={'OrganizationManager.name'} />
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
									format={limitLength(30)}
									disableOrder
								/>
							)
						} else if (question.type === "number") {
							return (
								<NumberCell
									key={question.id}
									field={`parameters(question.id='${question.id}').numericValue`}
									header={question.label}
									disableOrder
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
													<br />
												</React.Fragment>
											))}
										</>
									)}
								>
									<Field field={`value`} />
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
											value: query,
										})}
										render={({ entities }) => (
											<>
												{entities.map((entity) => (
													<React.Fragment key={entity.key}>
														{entity.getField('value').value}
														<br />
													</React.Fragment>
												))}
											</>
										)}
									>
										<Field field={`value`} />
									</HasManyFilterCell>
									<HasManyFilterCell
										key={question.id}
										field={`parameters(question.id='${question.id}').values`}
										header={question.label === 'Okres' ? 'Kraj' : `${question.label} - Kraj`}
										createWhere={(query) => ({
											district: { region: { name: query } },
										})}
										render={({ entities }) => (
											<>
												{entities.map((entity) => (
													<React.Fragment key={entity.key}>
														{entity.getField('district.region.name').value}
														<br />
													</React.Fragment>
												))}
											</>
										)}
									>
										<Field field={`district.region.name`} />
									</HasManyFilterCell>
								</>
							)
						} else {
							return null
						}
					}).filter(item => item !== null)
				}
				<TextCell field="internalNote" header="Interní poznámka" hidden format={limitLength(30)} />
				<TextCell field="volunteer.email" header="Dobrovolník: Email" hidden />
				<TextCell field="volunteer.phone" header="Dobrovolník: Telefon" hidden />
				<TextCell field="volunteer.expertise" header="Dobrovolník: Odbornost" hidden format={limitLength(30)} />
				<HasManySelectCell field="volunteer.tags" options="VolunteerTag.name" header="Dobrovolník: Tagy" />
				<TextCell field="volunteer.userNote" header="Dobrovolník: Poznámka uživatele" hidden
					format={limitLength(30)} />
				<TextCell field="volunteer.internalNote" header="Dobrovolník: Interní poznámka" hidden
					format={limitLength(30)} />
				<DateCell field="volunteer.createdAt" header="Dobrovolník: Datum registrace" hidden />
				<BooleanCell field="volunteer.createdInAdmin" header="Dobrovolník: Registrován administrátorem" hidden />
				{/*<GenericCell canBeHidden={false} shrunk>*/}
				{/*	<LinkButton to="editVolunteer(id: $entity.volunteer.id)">Dobrovolník</LinkButton>*/}
				{/*</GenericCell>*/}
			</>, []),
		})

		return (
			<GenericPage title="Nabídky" actions={
				<RoleConditional role={['admin', 'organizationAdmin']}>
					<ExportOffers dataGridProps={dataGridProps} listQuestion={query.data.listQuestion} />
				</RoleConditional>
			}>
				<DataBindingProvider stateComponent={FeedbackRenderer} refreshOnEnvironmentChange={false}>
					<ControlledDataGrid {...dataGridProps} />
				</DataBindingProvider>
			</GenericPage>
		)
	}
)

export const Offers = () => {
	const id = useCurrentRequest()!.parameters.id as string
	const { state: query } = useAuthedContentQuery<QuestionQueryResult, { id: string }>(LIST_QUESTION_QUERY, { id })

	if (query.state !== 'success') {
		return <></>
	} else {
		return <OffersGrid query={query} />
	}
}

