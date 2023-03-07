import { SchemaDefinition as def } from '@contember/schema-definition'
import { Model } from '@contember/schema'
import { Offer } from './Offer'
import { District } from './District'
import { Region } from './Region'
import { OfferVisit } from './OfferVisit'

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
export class Organization {
	name = def.stringColumn().notNull()
	address = def.stringColumn().notNull().default('')
	districts = def.manyHasMany(District, 'organizations')
	region = def.manyHasOne(Region, 'organizations')
	identificationNumber = def.stringColumn().notNull().default('')
	website = def.stringColumn().notNull().default('')
	note = def.stringColumn().nullable()
	nickname = def.stringColumn().nullable()
	parentOrganization = def.stringColumn().nullable()
	managers = def.oneHasMany(OrganizationManager, 'organization')
	organizationType = def.enumColumn(OrganizationTypeEnum).nullable()
	dateRegistered = def.dateTimeColumn().notNull().default('now')
	stats = def.oneHasOneInverse(OrganizationStats, 'organization')
}

@def.View(`
	SELECT
		gen_random_uuid() AS id,
		organization.id AS organization_id,
		(SELECT COUNT(*) FROM organization_manager WHERE organization_manager.organization_id = organization.id) AS userscount
	FROM organization
`)
export class OrganizationStats {
	organization = def.oneHasOne(Organization, 'stats').notNull()
	userscount = def.intColumn().notNull()
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
	visits = def.oneHasMany(OfferVisit, 'organizationManager').orderBy('stamp', def.OrderDirection.desc)
}
