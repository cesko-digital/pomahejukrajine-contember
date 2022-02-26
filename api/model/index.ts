import { SchemaDefinition as def } from "@contember/schema-definition"

export class Region { // Kraj
	name = def.stringColumn().notNull().unique()
	districts = def.oneHasMany(District, 'region').orderBy('name')
}

export class District { // Okres
	region = def.manyHasOne(Region, 'districts').notNull()
	name = def.stringColumn().notNull().unique()
	volunteer = def.manyHasManyInverse(Volunteer, 'districts')
}

export class VolunteerTag {
	order = def.intColumn().notNull().default(0)
	name = def.stringColumn().notNull().unique()
	volunteer = def.manyHasManyInverse(Volunteer, 'tags')
}

// 'accomodation', 'transportation', 'interpretation', 'volunteering', 'materials'
export class OfferType {
	order = def.intColumn().notNull().default(0)
	name = def.stringColumn().notNull().unique()
	hasCapacity = def.boolColumn().default(false).notNull()
	noteLabel = def.stringColumn().notNull().default('')
	noteRequired = def.boolColumn().default(false).notNull()

	offers = def.oneHasMany(Offer, 'type')
}

// ---

export class Volunteer {
	identityId = def.uuidColumn()
	email = def.stringColumn().notNull()
	phone = def.stringColumn().notNull().default('')
	offers = def.oneHasMany(Offer, 'volunteer')
	verified = def.boolColumn().default(false).notNull()
	banned = def.boolColumn().default(false).notNull()
	secretCode = def.stringColumn().unique()
	userNote = def.stringColumn().notNull().default('')
	internalNote = def.stringColumn().notNull().default('')
	expertise = def.stringColumn().notNull().default('')
	districts = def.manyHasMany(District, 'volunteer')
	tags = def.manyHasMany(VolunteerTag, 'volunteer').orderBy('order')
	createdAt = def.dateTimeColumn().notNull().default('now')
	createdInAdmin = def.boolColumn().default(false).notNull()
}

export class Offer {
	volunteer = def.manyHasOne(Volunteer, 'offers').notNull()
	type = def.manyHasOne(OfferType, 'offers').notNull()
	capacity = def.intColumn()
	userNote = def.stringColumn().notNull().default('')
	internalNote = def.stringColumn().notNull().default('')
	exhausted = def.boolColumn().notNull().default(false)
	// matches = def.oneHasMany(Match, 'offer')
}

// export class Demand {
// 	// TODO
// 	matches = def.oneHasMany(Match, 'demand')
// }

// export class Match {
// 	demand = def.manyHasOne(Demand, 'matches').notNull()
// 	offer = def.manyHasOne(Offer, 'matches').notNull()
// 	messages = def.oneHasMany(Message, 'match').orderBy('sentAt')
// 	createdAt = def.dateTimeColumn().notNull().default('now')
// 	completion = def.oneHasOneInverse(Completion, 'match')
// }

// export class Completion {
// 	match = def.oneHasOne(Match, 'completion').notNull()
// 	completedAt = def.dateTimeColumn().notNull().default('now')
// 	success = def.boolColumn().notNull().default(false)
// }

// export const MessageSide = def.createEnum('offer', 'demand')

// export class Message {
// 	match = def.manyHasOne(Match, 'messages').notNull().cascadeOnDelete()
// 	side = def.enumColumn(MessageSide).notNull()
// 	text = def.stringColumn().notNull()
// 	sentAt = def.dateTimeColumn().notNull().default('now')
// 	notificationSent = def.dateTimeColumn()
// }
