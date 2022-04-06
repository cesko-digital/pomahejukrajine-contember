import { SchemaDefinition as def } from '@contember/schema-definition'
import { Offer } from './Offer'

export class Reaction {
	offer = def.manyHasOne(Offer, 'reactions').notNull().cascadeOnDelete()
	createdAt = def.dateTimeColumn().notNull().default('now')
	email = def.stringColumn().notNull()
	phone = def.stringColumn().notNull().default('')
	secretCode = def.stringColumn().unique()
	verified = def.boolColumn().default(false).notNull()
	volunteerNotified = def.boolColumn().notNull().default(false)
}
