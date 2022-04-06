import { Component, DateCell, GenericCell, HasManySelectCell, LinkButton, TextCell } from '@contember/admin'
import * as React from 'react'

export const GridContent = Component(
	() => (
		<>
			<GenericCell shrunk canBeHidden>
				<LinkButton to="demandEdit(id: $entity.id)">Otevřít</LinkButton>
			</GenericCell>
			{/* <GenericCell header="Prohlíží" shrunk>
			<CurrentEntityKeyListener>
				{(data) => (<CollaborationList emails={data?.keys?.map(key => key.client.email) ?? []} />)}
			</CurrentEntityKeyListener>
		</GenericCell> */}
			<TextCell field="name" header="Jméno" />
			<HasManySelectCell field="types" header="Typ pomoci" options="OfferType.name" />
			<DateCell field="createdAt" header="Vytvořeno" initialOrder="desc" />
		</>
	),
	'GridContent',
)
