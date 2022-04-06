import { EditPage, Field, HasMany, MultiSelectField, NavigateBackButton, Section } from '@contember/admin'
import * as React from 'react'
import { OfferForm } from "../components/OfferForm"
import { OfferManage } from '../components/OfferManage'
import './offerEdit.sass'

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
