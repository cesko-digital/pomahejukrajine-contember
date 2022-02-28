import {
	CreatePage,
	DataGridPage,
	EditPage,
	EntityAccessor,
	GenericCell,
	HasOneSelectCell,
	HiddenField,
	LinkButton,
	MultiEditPage,
	SelectField,
	TextCell,
	TextField,
	useProjectSlug,
	useShowToast
} from "@contember/admin";
import { useInvite } from "../hooks/useInvite";
import * as React from "react";
import { useCallback } from "react";

export const organizations = (
	<MultiEditPage entities="Organization" rendererProps={{ title: "Organizace" }}>
		<TextField field="name" label="Název" />
	</MultiEditPage>
)

export const organizationManagerList = (
	<DataGridPage entities={'OrganizationManager'} itemsPerPage={100} rendererProps={{
		title: 'Pracovníci', actions: <>
			<LinkButton to={'organizationManagerAdd'}>Pridat</LinkButton>
		</>
	}}>
		<HasOneSelectCell options={'Organization.name'} field={'organization'} />
		<TextCell field="name" header="Jméno" />
		<TextCell field="email" header="Email" />
		<TextCell field="phone" header="Telefon" />
		<GenericCell canBeHidden={false} shrunk>
			<LinkButton to="organizationManagerEdit(id: $entity.id)">Detail</LinkButton>
		</GenericCell>
	</DataGridPage>
)

const useInviteManager = () => {
	const invite = useInvite()
	const project = useProjectSlug()
	const toast = useShowToast()

	return useCallback(async (getAccessor: () => EntityAccessor) => {
		const accessor = getAccessor()
		const personId = accessor.getField('personId');
		if (personId.value) {
			return
		}

		const result = await invite({
			email: String(accessor.getField('email').value),
			projectSlug: project!,
			memberships: [{ role: 'organizationManager', variables: [] }]
		})
		if (!result.ok) {
			toast({
				message: `Nepovedlo se pozvat osobu: ${result.error.developerMessage}`,
				dismiss: true,
				type: 'error',
			})
			return
		}
		personId.updateValue(result.result.person.id)
	}, [])
}
export const organizationManagerAdd = () => (
	<CreatePage entity={'OrganizationManager'} onBeforePersist={useInviteManager()} redirectOnSuccess={'organizationManagerList'}>
		<HiddenField field={'personId'} label={undefined} />
		<SelectField label={'Organizace'} options={'Organization.name'} field={'organization'} />
		<TextField field={'name'} label={'Jméno'} />
		<TextField field={'email'} label={'E-mail'} />
		<TextField field={'phone'} label={'Telefon'} />
	</CreatePage>
)


export const organizationManagerEdit = () => (
	<EditPage entity={'OrganizationManager(id = $id)'}>
		<SelectField label={'Organizace'} options={'Organization.name'} field={'organization'} />
		<TextField field={'name'} label={'Jméno'} />
		<TextField field={'email'} label={'E-mail'} />
		<TextField field={'phone'} label={'Telefon'} />
	</EditPage>
)
