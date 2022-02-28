import {
	BooleanCell,
	DataBindingProvider,
	DataGrid,
	DateCell,
	EditPage,
	Field,
	GenericCell,
	HasManySelectCell,
	LinkButton,
	TextCell,
	FeedbackRenderer,
	EntityListSubTree,
	Component,
	useField,
	HasMany,
	useAuthedContentQuery,
	GenericPage,
	TextField,
	Page,
	useCurrentRequest
} from '@contember/admin'
import * as React from 'react'
import { HasManyCell } from '../components/HasManyCell'
import { HasManyFilterCell } from '../components/HasManyFilterCell'
import {OfferForm} from "../components/OfferForm";

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

type QuestionQueryResult = {
	listQuestion: { id: string; label: string, type: string, options: { label: string, value: string }[] }[]
}

const OffersGrid = (
	() => {
		const id = useCurrentRequest()!.parameters.id
		const { state: query } = useAuthedContentQuery<QuestionQueryResult, { id: string }>(LIST_QUESTION_QUERY, { id })

		if (query.state !== 'success') {
			return <></>
		}

		return (
			<DataBindingProvider stateComponent={FeedbackRenderer} refreshOnEnvironmentChange={false}>
				<DataGrid entities="Offer[type.id=$id][volunteer.verified=true][volunteer.banned=false]" itemsPerPage={100}>
					<BooleanCell field="exhausted" header="Vyčerpáno" />
					{
						query.data.listQuestion.map(question => {
							if (["text", "radio", "textarea", "date"].includes(question.type)) {
								return (
									<TextCell
										key={question.id}
										field={`parameters(question.id='${question.id}').value`}
										header={question.label}
										hidden={question.type === "textarea"}
									/>
								)
							} else if (question.type === "number") {
								return (
									<TextCell
										key={question.id}
										field={`parameters(question.id='${question.id}').value`}
										header={question.label}
									/>
								)
							} else if (["checkbox", "district"].includes(question.type)) {
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
							} else {
								return null
							}
						}).filter(item => item !== null)
					}
					<TextCell field="internalNote" header="Interní poznámka" hidden />
					<TextCell field="volunteer.email" header="Dobrovolník: Email" hidden />
					<TextCell field="volunteer.phone" header="Dobrovolník: Telefon" hidden />
					<TextCell field="volunteer.expertise" header="Dobrovolník: Odbornost" hidden />
					<HasManySelectCell field="volunteer.tags" options="VolunteerTag.name" header="Dobrovolník: Tagy" />
					<TextCell field="volunteer.userNote" header="Dobrovolník: Poznámka uživatele" hidden />
					<TextCell field="volunteer.internalNote" header="Dobrovolník: Interní poznámka" hidden />
					<DateCell field="volunteer.createdAt" header="Dobrovolník: Datum registrace" hidden />
					<BooleanCell field="volunteer.createdInAdmin" header="Dobrovolník: Registrován administrátorem" hidden />
					{/*<GenericCell canBeHidden={false} shrunk>*/}
					{/*	<LinkButton to="editVolunteer(id: $entity.volunteer.id)">Dobrovolník</LinkButton>*/}
					{/*</GenericCell>*/}
					<GenericCell canBeHidden={false} shrunk>
						<LinkButton to="editOffer(id: $entity.id)">Detail nabídky</LinkButton>
					</GenericCell>
				</DataGrid>
			</DataBindingProvider >
		)
	}
)

export const offers = (
	<GenericPage>
		<OffersGrid />
	</GenericPage>
)

export const editOffer = (
	<EditPage entity="Offer(id=$id)">
		<h3><Field field="type.name" /></h3>
		<dl>
			<dt>Jméno:</dt>
			<dd><Field field="volunteer.name" /></dd>
			<dt>Organizace:</dt>
			<dd><Field field="volunteer.organization" /></dd>
			<dt>Telefon:</dt>
			<dd><Field field="volunteer.phone" /></dd>
			<dt>Email:</dt>
			<dd><Field field="volunteer.email" /></dd>
			<dt>Odbornost:</dt>
			<dd><Field field="volunteer.expertise" /></dd>
			<dt>Jazyky:</dt>
			<dd>
				<HasMany field="volunteer.languages">
					<Field field="language.name" />
					<br />
				</HasMany>
			</dd>
		</dl>
		<OfferForm />
	</EditPage>
)
