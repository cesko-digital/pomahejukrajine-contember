export * from './Demand'
export * from './District'
export * from './Language'
export * from './Offer'
export * from './Organization'
export * from './Question'
export * from './Reaction'
export * from './Region'
export * from './TypesenseSearchToken'
export * from './Volunteer'

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
