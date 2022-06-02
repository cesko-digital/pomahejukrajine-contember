import { SchemaDefinition as def } from '@contember/schema-definition'
import { Demand } from './Demand'
import { District } from './District'
import { OfferVisit } from './OfferVisit'
import { OrganizationManager } from './Organization'
import { Question } from './Question'
import { Reaction } from './Reaction'
import { Volunteer } from './Volunteer'

export class Offer {
	code = def.stringColumn().unique()
	volunteer = def.manyHasOne(Volunteer, 'offers').notNull()
	type = def.manyHasOne(OfferType, 'offers').notNull()
	name = def.stringColumn()
	nameUK = def.stringColumn()
	internalNote = def.stringColumn().notNull().default('')
	exhausted = def.boolColumn().notNull().default(false)
	parameters = def.oneHasMany(OfferParameter, 'offer')
	reactions = def.oneHasMany(Reaction, 'offer')
	assignees = def.manyHasMany(OrganizationManager, 'assignedOffers')
	status = def.manyHasOne(OfferStatus, 'offers')
	logs = def.oneHasMany(OfferLog, 'offer').orderBy('createdAt')
	details = def.oneHasOneInverse(OfferDetails, 'offer')
	isDeleted = def.boolColumn().notNull().default(false)
	createdAt = def.dateTimeColumn().notNull().default('now')
	isUKLanguage = def.boolColumn().notNull().default(false)
	visits = def.oneHasMany(OfferVisit, 'offer').orderBy('stamp', def.OrderDirection.desc)
}

@def.View(`
	SELECT
		gen_random_uuid() AS id,
	  offer_id,
		numeric_value AS numeric_value
	FROM offer_parameter
	JOIN question ON question.id = offer_parameter.question_id
	WHERE question.label = 'Počet'
`)
export class OfferDetails {
	numericValue = def.intColumn()
	offer = def.oneHasOne(Offer, 'details').notNull()
}

// 'accomodation', 'transportation', 'interpretation', 'volunteering', 'materials'
export class OfferType {
	order = def.intColumn().notNull().default(0)
	name = def.stringColumn().notNull().unique()
	nameUK = def.stringColumn().notNull().default('')
	infoText = def.stringColumn().notNull().default('')
	infoTextUK = def.stringColumn().notNull().default('')
	questions = def.oneHasMany(Question, 'offerType').orderBy('order')
	needsVerification = def.boolColumn().notNull().default(false) // vyžaduje ověření

	offers = def.oneHasMany(Offer, 'type')
	demands = def.manyHasManyInverse(Demand, 'types')
	hideInDemand = def.boolColumn().notNull().default(false)
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
	valueUK = def.stringColumn()
	numericValue = def.intColumn()
	specification = def.stringColumn()
	specificationUK = def.stringColumn()
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
	valueUK = def.stringColumn()
	specification = def.stringColumn()
	specificationUK = def.stringColumn()
	numericValue = def.intColumn()
	district = def.manyHasOne(District, 'offers')
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

export const OfferStatusEnum = def.createEnum('capacity_exhausted', 'bad_experience', 'outdated')

export class OfferStatus {
	order = def.intColumn().notNull().default(0)
	name = def.stringColumn().notNull().unique()
	offers = def.oneHasMany(Offer, 'status')
	type = def.enumColumn(OfferStatusEnum).unique()
}
