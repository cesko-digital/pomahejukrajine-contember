import * as React from 'react'
import {
	BooleanFieldView,
	CheckboxField,
	EditPage,
	FieldContainer,
} from '@contember/admin'
import { VolunteerForm } from '../forms/volunteersForms'

export default (
	<EditPage entity="Volunteer(id=$id)" rendererProps={{ title: "Dobrovolník" }}>
		<VolunteerForm />
		<CheckboxField field="banned" label="Zablokován" defaultValue={false} />
		<FieldContainer label="Registrován administrátorem" useLabelElement={false}>
			<BooleanFieldView field="createdInAdmin" />
		</FieldContainer>
	</EditPage>
)
