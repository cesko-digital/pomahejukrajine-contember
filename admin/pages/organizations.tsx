import * as React from "react"
import {DataGridPage, EnumCell, GenericCell, HasOneSelectCell, LinkButton, TextCell} from "@contember/admin"

export default (
	<DataGridPage entities="Organization" itemsPerPage={50} rendererProps={{ title: "Organizace", actions: <LinkButton to="organizationCreate">Přidat organizaci</LinkButton> }}>
		<TextCell field="name" header="Název" />
		<TextCell field="parentOrganization" header="Mateřská organizace" />
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
		<TextCell field="identificationNumber" header="IČ" />
		<TextCell field="address" header="Adresa" hidden />
		<HasOneSelectCell header="Kraje" field="region" options="Region.name" />
		<HasOneSelectCell header="Okres" field="district" options="District.name" />
		<TextCell header="Web" field="website" hidden />
		<TextCell header="Zkratka" field="nickname" hidden />
		<TextCell header="Poznámka" field="note" hidden />
		<GenericCell shrunk>
			<LinkButton to="organizationEdit(id: $entity.id)">Upravit</LinkButton>
		</GenericCell>
	</DataGridPage>
)
