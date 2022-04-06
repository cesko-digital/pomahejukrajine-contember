import { SchemaDefinition as def } from '@contember/schema-definition'
import { OfferParameter, OfferType } from './Offer'

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
