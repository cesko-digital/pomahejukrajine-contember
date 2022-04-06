import { SchemaDefinition as def } from '@contember/schema-definition'
import { District } from './District'
import { Language } from './Language'
import { Offer } from './Offer'

export const VolunteerCommunicationEnum = def.createEnum('not_set', 'active', 'does_not_exist', 'unreachable', 'inactive', 'verified')

export class Volunteer {
	identityId = def.stringColumn()
	name = def.stringColumn().notNull()
	email = def.stringColumn()
	phone = def.stringColumn().default('')
	organization = def.stringColumn().notNull().default('')
	contactHours = def.stringColumn().notNull().default('')
	languages = def.oneHasMany(VolunteerLanguage, 'volunteer')

	offers = def.oneHasMany(Offer, 'volunteer')
	verified = def.boolColumn().default(false).notNull()
	banned = def.boolColumn().default(false).notNull()
	secretCode = def.stringColumn().unique()
	userNote = def.stringColumn().notNull().default('')
	internalNote = def.stringColumn().notNull().default('')
	expertise = def.stringColumn().notNull().default('')
	districts = def.oneHasMany(VolunteerDistrict, 'volunteer')
	tags = def.manyHasMany(VolunteerTag, 'volunteers').orderBy('order')
	createdAt = def.dateTimeColumn().notNull().default('now')
	createdInAdmin = def.boolColumn().default(false).notNull()
	communicationWithVolunteer = def.enumColumn(VolunteerCommunicationEnum).default('not_set')
}

@def.Unique('volunteer', 'language')
export class VolunteerLanguage {
	volunteer = def.manyHasOne(Volunteer, 'languages').notNull()
	language = def.manyHasOne(Language, 'volunteers').notNull()
}

@def.Unique('volunteer', 'district')
export class VolunteerDistrict {
	volunteer = def.manyHasOne(Volunteer, 'districts').notNull().cascadeOnDelete()
	district = def.manyHasOne(District, 'volunteers').notNull()
}

export class VolunteerTag {
	order = def.intColumn().notNull().default(0)
	name = def.stringColumn().notNull().unique()
	volunteers = def.manyHasManyInverse(Volunteer, 'tags')
}
