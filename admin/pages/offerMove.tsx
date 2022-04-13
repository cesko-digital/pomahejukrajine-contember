import { EditPage, Field, NavigateBackButton, Section, SideDimensions, Stack } from '@contember/admin'
import * as React from 'react'
import { OfferParametersForm } from "../components/OfferForm"
import './offerEdit.sass'

export default (
	<EditPage
		entity="Offer(id=$id)"
		variables={{ type: '$type' }}
		rendererProps={{
			title: <Field field="type.name" />,
			navigation: <NavigateBackButton to="editOffer(id: $entity.id)">Zpět na původní nabídku</NavigateBackButton>
		}}
	>
		<Section heading="Nabídka">
			<div>(V současné chvíli mohou nabídku upravovat pouze superadministrátoři.)</div>
			<div style={{ display: 'flex', gap: '30px' }}>
				<Stack direction={'vertical'} style={{ backgroundColor: 'var(--cui-background-color--above)', padding: '10px' }}>
					<h4>Předchozí hodnoty</h4>
					<OfferParametersForm currentType />
				</Stack>
				<Stack direction={'vertical'}>
					<OfferParametersForm />
				</Stack>
			</div>
		</Section>
	</EditPage >
)
