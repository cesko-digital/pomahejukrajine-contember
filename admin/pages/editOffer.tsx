import { Button, EditPage, EntityView, Field, HasMany, MultiSelectField, NavigateBackButton, PersistButton, RichTextField, Section } from '@contember/admin'
import * as React from 'react'
import { Conditional } from '../components/Conditional'
import { OfferForm } from "../components/OfferForm"
import { OfferManage } from '../components/OfferManage'
import { RoleConditional } from '../components/RoleConditional'
import './offerEdit.sass'

export default (
	<EditPage
		entity="Offer(id=$id)"
		rendererProps={{
			title: <Field field="type.name" />,
			navigation: <NavigateBackButton to="offers(id: $entity.type.id)">Zpět na nabídky <Field field="type.name" /></NavigateBackButton>
		}}
	>
		{/* <CurrentEntitySharedKeyAcquirer /> */}
		<RoleConditional role={['admin', 'organizationAdmin']}>
			<Conditional
				showIf={(entity) => (entity.getField('isDeleted').valueOnServer != entity.getField('isDeleted').value) && entity.getField('isDeleted').valueOnServer === true}
				additionalStaticChildren={<Field field="isDeleted" />}
			>
					<div style={{ backgroundColor: '#fff', padding: '10px', borderRadius: '10px' }}>
					<span style={{ fontSize: '120%', color: 'green' }}>Opravdu chcete obnovit tuto nabídku?</span><br />

					<PersistButton />
				</div>
			</Conditional>
			<Conditional
				showIf={(entity) => (entity.getField('isDeleted').valueOnServer === true) && (entity.getField('isDeleted').value === true)}
				additionalStaticChildren={<Field field="isDeleted" />}
			>
				<div style={{ backgroundColor: '#fff', padding: '10px', borderRadius: '10px' }}>
					<span style={{ fontSize: '120%', color: 'red' }}>Tato nabídka je smazaná</span><br />

					<EntityView render={entity => <Button onClick={()=>{
						entity.getField('isDeleted').updateValue(false)
					}}>Obnovit nabídku</Button>} />
				</div>
			</Conditional>
		</RoleConditional>
		<OfferManage />
		<RichTextField field="internalNote" label="Interní poznámka" />
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
		<RoleConditional role={['admin', 'organizationAdmin']}>
			<Conditional
				showIf={(entity) => (entity.getField('isDeleted').valueOnServer != entity.getField('isDeleted').value) && entity.getField('isDeleted').valueOnServer === false}
				additionalStaticChildren={<Field field="isDeleted" />}
			>
					<div style={{ backgroundColor: '#fff', padding: '10px', borderRadius: '10px' }}>
					<span style={{ fontSize: '120%', color: 'red' }}>Opravdu chcete smazat tuto nabídku?</span><br />

					<PersistButton />
				</div>
			</Conditional>
			<Conditional
				showIf={(entity) => entity.getField('isDeleted').value === false}
				additionalStaticChildren={<Field field="isDeleted" />}
			>
				<EntityView render={entity => <Button onClick={()=>{
					entity.getField('isDeleted').updateValue(true)
				}}>Smazat nabídku</Button>} />
			</Conditional>
		</RoleConditional>
	</EditPage>
)
