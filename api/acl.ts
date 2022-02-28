import {PermissionsBuilder} from '@contember/schema-definition'
import {Acl, Model} from '@contember/schema'
import { OrganizationManager, VolunteerTag } from "./model";

const fieldNames = (model: Model.Schema, entity: string): string[] => {
	return Object.keys(model.entities[entity].fields)
}

const someFields = (predicate: Acl.Predicate, fields: string[]): Acl.FieldPermissions => {
	return Object.fromEntries(fields.map(field => [field, predicate]))
}

const allField = (model: Model.Schema, entity: string, predicate: Acl.Predicate): Acl.FieldPermissions => {
	return someFields(predicate, fieldNames(model, entity))
}

const allOperationsRoot = (model: Model.Schema, entity: string, predicate: Acl.Predicate): Acl.EntityOperations => {
	return {
		read: allField(model, entity, predicate),
		create: allField(model, entity, true),
		update: allField(model, entity, predicate),
		delete: predicate,
	}
}

const allOperationsChild = (model: Model.Schema, entity: string, predicate: Acl.Predicate): Acl.EntityOperations => {
	return {
		read: allField(model, entity, predicate),
		create: allField(model, entity, predicate),
		update: allField(model, entity, predicate),
		delete: predicate,
	}
}

const readOnly = (model: Model.Schema, entity: string, predicate: Acl.Predicate): Acl.EntityOperations => {
	return {
		read: allField(model, entity, predicate),
	}
}

const aclFactory = (model: Model.Schema): Acl.Schema => ({
	roles: {
		admin: {
			variables: {},
			stages: '*',
			entities: PermissionsBuilder.create(model).allowAll().permissions,
		},
		organizationManager: {
			variables: {
				personId: {
					type: Acl.VariableType.predefined,
					value: 'personID',
				}
			},
			stages: '*',
			entities: {
				Region: {
					predicates: {},
					operations: readOnly(model, 'Region', true),
				},
				District: {
					predicates: {},
					operations: readOnly(model, 'District', true),
				},
				Offer: {
					predicates: {
						assignable: {
							assignee: {
								or: [
									{
										personId: 'personId',
									},
									{
										personId: { isNull: true },
									}
								],
							},
						},
					},
					operations: {
						read: allField(model, 'Offer', true),
						update: {
							assignee: 'assignable',
						}
					},
				},
				OfferParameterValue: {
					predicates: {},
					operations: readOnly(model, 'OfferParameterValue', true),
				},
				OfferParameter: {
					predicates: {},
					operations: readOnly(model, 'OfferParameter', true),
				},
				OfferType: {
					predicates: {},
					operations: {
						read: allField(model, 'OfferType', true),
					},
				},
				Question: {
					predicates: {},
					operations: {
						read: allField(model, 'Question', true),
					},
				},
				QuestionOption: {
					predicates: {},
					operations: {
						read: allField(model, 'QuestionOption', true),
					},
				},
				Language: {
					predicates: {},
					operations: {
						read: allField(model, 'Language', true),
					},
				},
				Organization: {
					predicates: {},
					operations: readOnly(model, 'Organization', true),
				},
				OrganizationManager: {
					predicates: {},
					operations: readOnly(model, 'OrganizationManager', true),
				},
				Volunteer: {
					predicates: {},
					operations: readOnly(model, 'Volunteer', true),
				},
				VolunteerDistrict: {
					predicates: {},
					operations: readOnly(model, 'VolunteerDistrict', true),
				},
				VolunteerLanguage: {
					predicates: {},
					operations: readOnly(model, 'VolunteerLanguage', true),
				},
				VolunteerTag: {
					predicates: {},
					operations: readOnly(model, 'VolunteerTag', true),
				},
			},
		},
		public: {
			variables: {},
			stages: '*',
			entities: {
				Region: {
					predicates: {},
					operations: readOnly(model, 'Region', true),
				},
				District: {
					predicates: {},
					operations: readOnly(model, 'District', true),
				},
				OfferType: {
					predicates: {},
					operations: {
						read: allField(model, 'OfferType', true),
					},
				},
				Question: {
					predicates: {},
					operations: {
						read: allField(model, 'Question', true),
					},
				},
				QuestionOption: {
					predicates: {},
					operations: {
						read: allField(model, 'QuestionOption', true),
					},
				},
				Language: {
					predicates: {},
					operations: {
						read: allField(model, 'Language', true),
					},
				},
			},
		},
		volunteer: {
			inherits: ['public'],
			variables: {
				volunteerId: {
					type: Acl.VariableType.entity,
					entityName: 'Volunteer',
				},
			},
			stages: '*',
			entities: {
				Volunteer: {
					predicates: { self: { id: { eq: 'volunteerId' } } },
					operations: {
						read: someFields('self', ['email', 'phone', 'userNote', 'expertise', 'districts', 'offers']),
						update: someFields('self', ['userNote', 'expertise', 'districts', 'offers']),
					},
				},
				Offer: {
					predicates: {
						self: { volunteer: { id: { eq: 'volunteerId' }, }, },
					},
					operations: {
						read: someFields('self', ['type']),
						// update: someFields('self', ['userNote']),
						delete: 'self',
					},
				},
			},
		}
	},
})

export default aclFactory
