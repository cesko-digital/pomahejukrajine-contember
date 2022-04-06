import * as React from 'react'
import { CreatePage } from '@contember/admin'
import { OfferTypeForms } from '../forms/offerTypeForms'

export default (
	<CreatePage entity="OfferType" rendererProps={{ title: "Typy nabídek" }} redirectOnSuccess="offerTypeEdit">
		<OfferTypeForms />
	</CreatePage>
)
