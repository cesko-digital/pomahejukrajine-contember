import { SchemaDefinition as def } from '@contember/schema-definition'
import { Model } from '@contember/schema'
import { Offer } from './Offer'

export class Organization {
	name = def.stringColumn().notNull()
	managers = def.oneHasMany(OrganizationManager, 'organization')
}

export const OrganizationManagerRoleEnum = def.createEnum('organizationManager', 'organizationAdmin')
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
