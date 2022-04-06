import * as React from 'react'
import { LinkButton, MultiEditPage, PersistButton, TextField } from '@contember/admin'

export default (
	<MultiEditPage entities="OfferType" rendererProps={{ sortableBy: "order", title: "Typy nabídek", actions: <PersistButton /> }}>
		<TextField field="name" label="Název" />
		<LinkButton to="offerTypeEdit(id: $entity.id)">Upravit</LinkButton>
	</MultiEditPage>
)
