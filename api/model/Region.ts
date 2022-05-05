import { SchemaDefinition as def } from '@contember/schema-definition'
import { District } from './District'
import { Organization } from './Organization'

export class Region { // Kraj
	name = def.stringColumn().notNull().unique()
	nameUK = def.stringColumn().notNull().default('')
	districts = def.oneHasMany(District, 'region').orderBy('name')
	organizations = def.oneHasMany(Organization, 'region')
}
