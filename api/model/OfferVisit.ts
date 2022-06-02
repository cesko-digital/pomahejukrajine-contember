import { SchemaDefinition as def } from '@contember/schema-definition'
import { Offer } from './Offer'
import { OrganizationManager } from './Organization'

export class OfferVisit {
	stamp = def.dateTimeColumn().notNull().default('now')
	offer = def.manyHasOne(Offer, 'visits').notNull().cascadeOnDelete()
	organizationManager = def.manyHasOne(OrganizationManager, 'visits').notNull().cascadeOnDelete()
}
