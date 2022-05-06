import * as React from 'react'
import { BooleanCell, DataGridPage, DateCell, Field, GenericCell, HasManySelectCell, LinkButton, TextCell } from '@contember/admin'
import { HasManyCell } from "../components/HasManyCell"
import { limitLength } from '../utils/limitLength'

export default (
	<DataGridPage entities="Volunteer[banned=true]" itemsPerPage={100} rendererProps={{ title: "Neverifikovaní dobrovolníci" }}>
		<TextCell field="email" header="Email" format={limitLength(30)} />
		<TextCell field="phone" header="Telefon" format={limitLength(30)} />
		<TextCell field="name" header="Jméno" format={limitLength(30)} />
		<TextCell field="expertise" header="Odbornost" format={limitLength(30)} />
		<HasManyCell field="districts" entityList="District" hasOneField="district" header="Okresy">
			<Field field="name" />
		</HasManyCell>
		<HasManySelectCell field="tags" options="VolunteerTag.name" header="Tagy" />
		<TextCell field="userNote" header="Poznámka uživatele" hidden format={limitLength(30)} />
		<TextCell field="internalNote" header="Interní poznámka" hidden format={limitLength(30)} />
		<DateCell field="createdAt" header="Datum registrace" hidden />
		<BooleanCell field="createdInAdmin" header="Registrován administrátorem" hidden />
		<GenericCell canBeHidden={false} shrunk>
			<LinkButton to="editVolunteer(id: $entity.id)">Detail</LinkButton>
		</GenericCell>
	</DataGridPage>
)
