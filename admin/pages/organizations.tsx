import * as React from "react"
import {DataGridPage, EnumCell, GenericCell, LinkButton, TextCell, DateCell} from "@contember/admin"

export default (
	<DataGridPage entities="Organization" itemsPerPage={50} rendererProps={{ title: "Organizace", actions: <LinkButton to="organizationCreate">Přidat organizaci</LinkButton> }}>
		<TextCell field="name" header="Název" />
		<TextCell field="parentOrganization" header="Mateřská organizace" />
        <DateCell field="dateRegistered" header="Datum Registrace" />
		<EnumCell field="organizationType"
							options=
								{{
									collegeInitiative: 'Školské zařízení',
									researchAndUniversitySector: 'Výzkumný a vysokoškolský sektor',
									governmentOrganization: 'Vládní a veřejná organizace',
									privateOrganization: 'Soukromý podnik',
									other: 'Ostatní',
									osvcPerson: 'Osoba - OSVČ',
									municipality: 'Obec',
									nonprofit: 'Nevládní/neziskový sektor',
									foundation: 'Nadace',
									media: 'Média',
									church: 'Církev',
									volunteerInitiative: 'Dobrovolnická iniciativa',
								}}
							header="Typ organizace" />
		<GenericCell shrunk>
			<LinkButton to="organizationEdit(id: $entity.id)">Upravit</LinkButton>
		</GenericCell>
	</DataGridPage>
)
