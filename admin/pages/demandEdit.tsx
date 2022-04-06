import { EditPage, CheckboxField, Field, HasMany } from '@contember/admin'
import * as React from 'react'

export default (
	<EditPage
		entity="Demand(id = $id)"
		rendererProps={{ side: <CheckboxField field="solved" label="Vyřešeno" /> }}
	>
		{/* <CurrentEntitySharedKeyAcquirer /> */}
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
