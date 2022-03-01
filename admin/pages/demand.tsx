import { CheckboxField, Component, DataGridPage, DateCell, EditPage, Field, GenericCell, HasMany, HasManySelectCell, LinkButton, TextCell, TextField } from '@contember/admin'
import * as React from 'react'
import { CollaborationList } from '../components/CollaborationList'
import { CurrentEntityKeyListener } from '../utils/collaboration/CurrentEntityKeyListener'
import { CurrentEntitySharedKeyAcquirer } from '../utils/collaboration/CurrentEntitySharedKeyAcquirer'

const GridContent = Component(() => (
	<>
		<GenericCell shrunk canBeHidden>
			<LinkButton to="demandEdit(id: $entity.id)">Otevřít</LinkButton>
		</GenericCell>
		<GenericCell header="Prohlíží" shrunk>
			<CurrentEntityKeyListener>
				{(data) => (<CollaborationList emails={data?.keys?.map(key => key.client.email) ?? []} />)}
			</CurrentEntityKeyListener>
		</GenericCell>
		<TextCell field="name" header="Jméno" />
		<HasManySelectCell field="types" header="Typ pomoci" options="OfferType.name" />
		<DateCell field="createdAt" header="Vytvořeno" initialOrder="desc" />
	</>
))

export const demandList = (
	<DataGridPage
		entities="Demand[solved=false]"
		rendererProps={{title: 'Seznam žádostí'}}
	>
		<GridContent />
	</DataGridPage>
)

export const demandListSolved = (
	<DataGridPage
		entities="Demand[solved=true]"
		rendererProps={{title: 'Seznam žádostí'}}
	>
		<GridContent />
	</DataGridPage>
)

export const demandEdit = (
	<EditPage
		entity="Demand(id = $id)"
		rendererProps={{ side: <CheckboxField field="solved" label="Vyřešeno" /> }}
	>
		<CurrentEntitySharedKeyAcquirer />
		<div className="volunteer-wrapper">
			<table>
				<tr>
					<td>Jméno</td>
					<td><Field field="name" /></td>
				</tr>
				<tr>
					<td>E-mail</td>
					<td><Field field="email" /></td>
				</tr>
				<tr>
					<td>Telefon</td>
					<td><Field field="phone" /></td>
				</tr>
				<tr>
					<td>Vhodná doba pro kontaktování</td>
					<td><Field field="contactHours" /></td>
				</tr>
				<tr>
					<td>Typ pomoci</td>
					<td><HasMany field="types"><Field field="name" />, </HasMany></td>
				</tr>
				<tr>
					<td>Jiná pomoc</td>
					<td><Field field="otherType" /></td>
				</tr>
			</table>
		</div>
	</EditPage>
)
