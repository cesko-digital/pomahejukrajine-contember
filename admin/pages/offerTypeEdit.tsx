import * as React from 'react'
import { EditPage, NavigateBackButton } from '@contember/admin'
import { OfferTypeForms } from '../forms/offerTypeForms'

export default (
	<EditPage entity="OfferType(id = $id)" rendererProps={{ title: "Typy nabídek", navigation: <NavigateBackButton to="offerTypes">Zpět na výpis typů nabídek</NavigateBackButton> }} >
		<OfferTypeForms />
	</EditPage>
)
