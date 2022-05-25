import { SchemaDefinition as def } from '@contember/schema-definition'

/** Frequently asked question
 *
 *  Must have both czech and Ukrainian version, locale should switch fields.
 */
export class FrequentlyAskedQuestion {
    order = def.intColumn().notNull().default(0)
    question = def.stringColumn().notNull().unique()
    questionUA = def.stringColumn().notNull()
    answer = def.stringColumn().notNull()
    answerUA = def.stringColumn().notNull()
}
