import { SchemaDefinition as def } from '@contember/schema-definition'
import { VolunteerLanguage } from './Volunteer'

export class Language {
	order = def.intColumn().notNull().default(0)
	name = def.stringColumn().notNull().unique()
	volunteers = def.oneHasMany(VolunteerLanguage, 'language')
}
