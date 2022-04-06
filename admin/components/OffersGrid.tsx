import * as React from 'react'
import { BooleanCell, ControlledDataGrid, DataBindingProvider, DateCell, FeedbackRenderer, Field, GenericCell, GenericPage, HasManySelectCell, HasOneSelectCell, LinkButton, NumberCell, TextCell, useDataGrid } from '@contember/admin'
import { limitLength } from '../utils/limitLength'
import { ExportOffers } from './ExportOffers'
import { HasManyCell } from './HasManyCell'
import { HasManyFilterCell } from './HasManyFilterCell'
import { RoleConditional } from './RoleConditional'

export type QuestionQueryResult = {
	listQuestion: { id: string; label: string, type: string, options: { label: string, value: string }[] }[]
}

export const OffersGrid = (
	({ query }: { query: { data: QuestionQueryResult } }) => {
		const dataGridProps = useDataGrid({
			entities: 'Offer[type.id=$id][volunteer.verified=true][volunteer.banned=false]',
			itemsPerPage: 20,
			children: React.useMemo(() => <>
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
				<TextCell field="internalNote" header="Interní poznámka" hidden format={limitLength(30, true)} />
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
