import {
	BooleanCell,
	Button,
	Component,
	DataBindingProvider,
	DataGrid,
	DateCell,
	EditPage,
	FeedbackRenderer,
	Field,
	GenericCell,
	GenericPage,
	HasMany,
	HasManySelectCell, HasOneSelectCell,
	LinkButton,
	TextCell,
	useAuthedContentMutation,
	useAuthedContentQuery,
	useCurrentRequest,
	useEntity, useEnvironment,
	useIdentity, useRedirect
} from '@contember/admin'
import * as React from 'react'
import { useCallback } from 'react'
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
		const id = useCurrentRequest()!.parameters.id as string
		const { state: query } = useAuthedContentQuery<QuestionQueryResult, { id: string }>(LIST_QUESTION_QUERY, { id })

		if (query.state !== 'success') {
			return <></>
		}

		return (
			<DataBindingProvider stateComponent={FeedbackRenderer} refreshOnEnvironmentChange={false}>
				<DataGrid entities="Offer[type.id=$id][volunteer.verified=true][volunteer.banned=false]" itemsPerPage={100}>
					<HasOneSelectCell field="assignee" header="Přiřazen" options={'OrganizationManager.name'} />
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

const OfferManage = Component(() => {
	const offer = useEntity()
	const assignee = offer.getEntity('assignee')
	const identity = useIdentity()
	const env = useEnvironment()
	const [assignSelf] = useAuthedContentMutation<{
		ok: boolean
		errorMessage?: string
	}, {personId: string, offerId: string}>(`
mutation($offerId: UUID!, $personId: UUID!) {
	updateOffer(by: {id: $offerId}, data: {assignee: {connect: {personId: $personId}}}) {
		ok
		errorMessage
	}
}
`)
	const redirect = useRedirect()
	const assign = useCallback(async () => {
		await assignSelf({ personId: identity.personId, offerId: offer.id })
		redirect('editOffer(id: $entity.id)')
	}, [assignSelf, redirect])

	const [unassignSelf] = useAuthedContentMutation<{
		ok: boolean
		errorMessage?: string
	}, { offerId: string }>(`
mutation($offerId: UUID!) {
	updateOffer(by: {id: $offerId}, data: {assignee: {disconnect: true}}) {
		ok
		errorMessage
	}
}
`)
	const unassign = useCallback(async () => {
		await unassignSelf({  offerId: offer.id })
		redirect('editOffer(id: $entity.id)')
	}, [assignSelf, redirect])

	const assignedPerson = assignee.getField('personId').value
	if (assignedPerson === identity.personId) {
		return <>
			<Button onClick={unassign}>Zrušit přiřazení</Button>
		</> // todo: show detail
	} else if (assignedPerson) {
		return <>Prirazen {assignee.getField('name').value}</>
	}
	return <Button onClick={assign}>Přiřadit sebe</Button>
}, () => (
	<>
		<Field field={'assignee.personId'} />
		<Field field={'assignee.name'} />
	</>
))

export const editOffer = (
	<EditPage entity="Offer(id=$id)">
		<h3><Field field="type.name" /></h3>
		<OfferManage />
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
