import { SchemaDefinition as def } from "@contember/schema-definition"
import { Model } from "@contember/schema"

export class Region { // Kraj
	name = def.stringColumn().notNull().unique()
	districts = def.oneHasMany(District, 'region').orderBy('name')
}

export class District { // Okres
	region = def.manyHasOne(Region, 'districts').notNull()
	name = def.stringColumn().notNull().unique()
	volunteers = def.oneHasMany(VolunteerDistrict, 'district')
	offerParameterValues = def.oneHasMany(OfferParameterValueDetails, 'district')
}

export class VolunteerTag {
	order = def.intColumn().notNull().default(0)
	name = def.stringColumn().notNull().unique()
	volunteers = def.manyHasManyInverse(Volunteer, 'tags')
}

// 'accomodation', 'transportation', 'interpretation', 'volunteering', 'materials'
export class OfferType {
	order = def.intColumn().notNull().default(0)
	name = def.stringColumn().notNull().unique()
	nameUK = def.stringColumn().notNull().default('')
	infoText = def.stringColumn().notNull().default('')
	questions = def.oneHasMany(Question, 'offerType').orderBy('order')
	needsVerification = def.boolColumn().notNull().default(false) // vyžaduje ověření

	offers = def.oneHasMany(Offer, 'type')
	demands = def.manyHasManyInverse(Demand, 'types')
	hideInDemand = def.boolColumn().notNull().default(false)
}

export const QuestionType = def.createEnum('radio', 'checkbox', 'text', 'textarea', 'number', 'date', 'district')

export class Question {
	offerType = def.manyHasOne(OfferType, 'questions').notNull().cascadeOnDelete()
	order = def.intColumn().notNull().default(0)
	label = def.stringColumn().notNull()
	question = def.stringColumn().notNull()
	type = def.enumColumn(QuestionType).notNull()
	options = def.oneHasMany(QuestionOption, 'question').orderBy('order')
	required = def.boolColumn().default(false).notNull()
	public = def.boolColumn().default(false).notNull()

	offerParameters = def.oneHasMany(OfferParameter, 'question')
}

export class QuestionOption {
	question = def.manyHasOne(Question, 'options').notNull().cascadeOnDelete()
	order = def.intColumn().notNull().default(0)
	value = def.stringColumn().notNull()
	label = def.stringColumn().notNull()
	requireSpecification = def.boolColumn().default(false).notNull()
}

export class Language {
	order = def.intColumn().notNull().default(0)
	name = def.stringColumn().notNull().unique()
	volunteers = def.oneHasMany(VolunteerLanguage, 'language')
}

export const OfferStatusEnum = def.createEnum('capacity_exhausted', 'bad_experience', 'outdated')
export class OfferStatus {
	order = def.intColumn().notNull().default(0)
	name = def.stringColumn().notNull().unique()
	offers = def.oneHasMany(Offer, 'status')
	type = def.enumColumn(OfferStatusEnum).unique()
}

// ---

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

export class Offer {
	code = def.stringColumn().unique()
	volunteer = def.manyHasOne(Volunteer, 'offers').notNull()
	type = def.manyHasOne(OfferType, 'offers').notNull()
	internalNote = def.stringColumn().notNull().default('')
	exhausted = def.boolColumn().notNull().default(false)
	parameters = def.oneHasMany(OfferParameter, 'offer')
	reactions = def.oneHasMany(Reaction, 'offer')
	assignees = def.manyHasMany(OrganizationManager, 'assignedOffers')
	status = def.manyHasOne(OfferStatus, 'offers')
	logs = def.oneHasMany(OfferLog, 'offer').orderBy('createdAt')
}

export class OfferLog {
	offer = def.manyHasOne(Offer, 'logs').notNull()
	createdAt = def.dateTimeColumn().notNull().default('now')
	text = def.stringColumn().notNull()
	author = def.manyHasOne(OrganizationManager).notNull()
}

@def.Unique('offer', 'question')
export class OfferParameter {
	offer = def.manyHasOne(Offer, 'parameters').notNull().cascadeOnDelete()
	question = def.manyHasOne(Question, 'offerParameters').notNull()
	value = def.stringColumn()
	specification = def.stringColumn()
	values = def.oneHasMany(OfferParameterValue, 'parameter')
	details = def.oneHasOneInverse(OfferParameterDetails, 'offerParameter').notNull()
}

@def.View(`
	SELECT
		gen_random_uuid() AS id,
		offer_parameter.id AS offer_parameter_id,
		CASE WHEN value ~ '^[0-9]{1,8}$' THEN value::int ELSE null END AS numeric_value
	FROM offer_parameter
`)
export class OfferParameterDetails {
	numericValue = def.intColumn()
	offerParameter = def.oneHasOne(OfferParameter, 'details').notNull()
}

export class OfferParameterValue {
	parameter = def.manyHasOne(OfferParameter, 'values').notNull().cascadeOnDelete()
	value = def.stringColumn().notNull()
	specification = def.stringColumn()
	details = def.oneHasOneInverse(OfferParameterValueDetails, 'value').notNull()
}

@def.View(`
	SELECT
		gen_random_uuid() AS id,
		value.id AS value_id,
		(SELECT id FROM district WHERE district.name = value.value) AS district_id
	FROM offer_parameter_value value
`)
export class OfferParameterValueDetails {
	district = def.manyHasOne(District, 'offerParameterValues')
	value = def.oneHasOne(OfferParameterValue, 'details').notNull()
}

export class Reaction {
	offer = def.manyHasOne(Offer, 'reactions').notNull().cascadeOnDelete()
	createdAt = def.dateTimeColumn().notNull().default('now')
	email = def.stringColumn().notNull()
	phone = def.stringColumn().notNull().default('')
	secretCode = def.stringColumn().unique()
	verified = def.boolColumn().default(false).notNull()
	volunteerNotified = def.boolColumn().notNull().default(false)
}

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
