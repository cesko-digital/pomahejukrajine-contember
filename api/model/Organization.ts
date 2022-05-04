import { SchemaDefinition as def } from '@contember/schema-definition'
import { Model } from '@contember/schema'
import { Offer } from './Offer'
import { District } from './District'

export const OrganizationTypeEnum = def.createEnum(
	'collegeInitiative',
	'researchAndUniversitySector',
	'governmentOrganization',
	'privateOrganization',
	'other',
	'osvcPerson',
	'municipality',
	'nonprofit',
	'foundation',
	'media',
	'church',
	'volunteerInitiative'
)

// TODO: okres, kraj
export class Organization {
	name = def.stringColumn().notNull()
	address = def.stringColumn().notNull()
	identificationNumber = def.stringColumn().notNull()
	website = def.stringColumn().notNull()
	note = def.stringColumn().nullable()
	parentOrganization = def.stringColumn().nullable()
	managers = def.oneHasMany(OrganizationManager, 'organization')
	organizationType = def.enumColumn(OrganizationTypeEnum).nullable()
}

export const OrganizationManagerRoleEnum = def.createEnum('organizationManager', 'organizationAdmin', 'volunteer')

export class OrganizationManager {
	personId = def.column(Model.ColumnType.Uuid).unique().notNull()
	identityId = def.column(Model.ColumnType.Uuid).unique()
	organization = def.manyHasOne(Organization, 'managers').notNull().cascadeOnDelete()
	name = def.stringColumn().notNull()
	email = def.stringColumn().notNull()
	phone = def.stringColumn().notNull().default('')
	assignedOffers = def.manyHasManyInverse(Offer, 'assignees')
	role = def.enumColumn(OrganizationManagerRoleEnum).notNull().default('organizationManager')
}
