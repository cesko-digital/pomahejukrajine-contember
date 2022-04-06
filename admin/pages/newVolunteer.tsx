import * as React from 'react'
import {
	CreatePage,
	HiddenField,
} from '@contember/admin'
import { VolunteerForm } from '../forms/volunteersForms'

export default (
	<CreatePage entity="Volunteer" rendererProps={{ title: "Registrovat dobrovolníka" }} redirectOnSuccess="index">
		<HiddenField label={undefined} field="createdInAdmin" defaultValue={true} />
		<VolunteerForm />
	</CreatePage>
)
