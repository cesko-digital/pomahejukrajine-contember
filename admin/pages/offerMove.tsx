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
			<div style={{ display: 'flex', gap: '30px' }}>
				<Stack direction={'vertical'} style={{ backgroundColor: 'var(--cui-background-color--above)', padding: '10px' }}>
					<h4 style={{ color: '#000', fontSize: '120%', margin: '0' }}>Aktuální hodnoty</h4>
					<p style={{ marginTop: '0' }}>Doporučujeme neměnit, pak se můžete snadno vrátit k původní nabídce.</p>
					<OfferParametersForm currentType />
				</Stack>
				<Stack direction={'vertical'}>
					<h4 style={{ color: '#000', fontSize: '120%', margin: '0' }}>Nové hodnoty</h4>
					<p style={{ marginTop: '0' }}>Začněte tím, že změníte typ nabídky a následně doplňte potřebná pole.</p>
					<OfferParametersForm />
				</Stack>
			</div>
		</Section>
	</EditPage >
)
