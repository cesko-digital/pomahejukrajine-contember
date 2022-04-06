import {
	Button,
	Component,
	EditPage,
	Field,
	HasMany,
	MultiSelectField,
	NavigateBackButton,
	Section,
	useAuthedContentMutation,
	useEntity,
	useEnvironment,
	useIdentity,
	useRedirect
} from '@contember/admin'
import * as React from 'react'
import { useCallback } from 'react'
import { OfferForm } from "../components/OfferForm"
import './offer.sass'

const OfferManage = Component(() => {
	const offer = useEntity()
	const assignees = offer.getEntityList('assignees')
	const identity = useIdentity()
	const env = useEnvironment()
	const [assignSelf] = useAuthedContentMutation<{
		ok: boolean
		errorMessage?: string
	}, { personId: string, offerId: string }>(`
mutation($offerId: UUID!, $personId: UUID!) {
	updateOffer(by: {id: $offerId}, data: {assignees: {connect: {personId: $personId}}}) {
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
	}, { offerId: string, personId: string }>(`
mutation($offerId: UUID!, $personId: UUID!) {
	updateOffer(by: {id: $offerId}, data: {assignees: {disconnect: {personId: $personId}}}) {
		ok
		errorMessage
	}
}
`)
	const unassign = useCallback(async () => {
		await unassignSelf({ personId: identity.personId, offerId: offer.id })
		redirect('editOffer(id: $entity.id)')
	}, [assignSelf, redirect])

	const assignedPersonIds = Array.from(assignees).map(it => it.getField('personId').value)
	const assignedPersonNames = Array.from(assignees).map(it => it.getField('name').value)

	return (
		<>
			<p>Přiřazen: {assignedPersonNames.length > 0 ? assignedPersonNames.join(', ') : 'nikdo'}</p>
			{assignedPersonIds.includes(identity.personId)
				? <Button onClick={unassign}>Odebrat sebe</Button>
				: <Button onClick={assign}>Přiřadit se k nabídce</Button>
			}
		</>
	)
}, () => (
	<HasMany field={'assignees'}>
		<Field field={'personId'} />
		<Field field={'name'} />
	</HasMany>
))

export default (
	<EditPage
		entity="Offer(id=$id)"
		pageName="editOffer"
		rendererProps={{
			title: <Field field="type.name" />,
			navigation: <NavigateBackButton to="offers(id: $entity.type.id)">Zpět na nabídky <Field field="type.name" /></NavigateBackButton>
		}}
	>
		{/* <CurrentEntitySharedKeyAcquirer /> */}
		<OfferManage />
		<OfferForm />
		<Section heading="Dobrovolník">
			<div>
				Pro zobrazení konktaktních údajů musíte mít na sebe přiřazenou nabídku.
			</div>
			<div className="volunteer-wrapper">
				<MultiSelectField label="Tagy dobrovolníka" field="volunteer.tags" options="VolunteerTag.name" />
				<table style={{ marginTop: '10px' }}>
					<tr>
						<td>Jméno</td>
						<td><Field field="volunteer.name" /></td>
					</tr>
					<tr>
						<td>Organizace</td>
						<td><Field field="volunteer.organization" /></td>
					</tr>
					<tr>
						<td>Telefon</td>
						<td><Field field="volunteer.phone" /></td>
					</tr>
					<tr>
						<td>Email</td>
						<td><Field field="volunteer.email" /></td>
					</tr>
					<tr>
						<td>Odbornost</td>
						<td><Field field="volunteer.expertise" /></td>
					</tr>
					<tr>
						<td>Jazyky</td>
						<td>
							<HasMany field="volunteer.languages">
								<Field field="language.name" />{' '}
							</HasMany>
						</td>
					</tr>
				</table>
			</div>
		</Section>
	</EditPage>
)
