import { SchemaDefinition as def } from '@contember/schema-definition'
import { OfferType } from './Offer'

export class Demand {
	name = def.stringColumn().notNull()
	email = def.stringColumn().notNull()
	phone = def.stringColumn().default('')
	types = def.manyHasMany(OfferType, 'demands')
	otherType = def.stringColumn()
	contactHours = def.stringColumn().notNull().default('')
	createdAt = def.dateTimeColumn().notNull().default('now')
	solved = def.boolColumn().default(false).notNull()
}
