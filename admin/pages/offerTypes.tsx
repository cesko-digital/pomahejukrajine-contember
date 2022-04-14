import * as React from 'react'
import { LinkButton, MultiEditPage, PersistButton, TextField } from '@contember/admin'

export default (
	<MultiEditPage entities="OfferType" rendererProps={{ sortableBy: "order", title: "Typy nabídek", actions: <PersistButton /> }}>
		<div style={{ display: 'flex', gap: '10px' }}>
			<TextField field="name" label="Název" />
			<TextField field="nameUK" label="Název v Ukrajinštině" />
		</div>
		<LinkButton to="offerTypeEdit(id: $entity.id)">Upravit</LinkButton>
	</MultiEditPage>
)
