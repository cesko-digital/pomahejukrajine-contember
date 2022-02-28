import { BooleanCell, DataBindingProvider, DataGrid, DateCell, EditPage, Field, GenericCell, HasManySelectCell, LinkButton, TextCell, FeedbackRenderer, EntityListSubTree, Component, useField, HasMany, useAuthedContentQuery, GenericPage, TextField } from '@contember/admin'
import * as React from 'react'
import { HasManyCell } from '../components/HasManyCell'

const LIST_QUESTION_QUERY = `
	query {
		listQuestion {
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
		const { state: query } = useAuthedContentQuery<QuestionQueryResult, {}>(LIST_QUESTION_QUERY, {})

		if (query.state !== 'success') {
			return <></>
		}

		return (
			<DataBindingProvider stateComponent={FeedbackRenderer} refreshOnEnvironmentChange={false}>
				<DataGrid entities="Offer[type.id=$id][volunteer.verified=true][volunteer.banned=false]" itemsPerPage={100}>
					<BooleanCell field="exhausted" header="Vyčerpáno" />
					{
						query.data.listQuestion.map(question => (
							<GenericCell header={question.label}>
								{question.type}

								{/* {question.options} */}
							</GenericCell>


						))
					}
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
		<h4><Field field="type.name" /></h4>
		<HasMany field="parameters">
			<strong><Field field="question.question" /></strong>
			<HasMany field="question.offerParameters[offer.id=$id]">
				<HasMany field="values">
					<Field field="value" /><br />
				</HasMany>
			</HasMany>
		</HasMany>
	</EditPage>
)
