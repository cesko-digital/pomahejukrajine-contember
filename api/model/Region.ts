import { SchemaDefinition as def } from '@contember/schema-definition'
import { District } from './District'

export class Region { // Kraj
	name = def.stringColumn().notNull().unique()
	nameUK = def.stringColumn().notNull().default('')
	districts = def.oneHasMany(District, 'region').orderBy('name')
}
