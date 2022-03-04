import { PermissionsBuilder } from '@contember/schema-definition'
import { Acl, Model } from '@contember/schema'
import { OrganizationManager, VolunteerTag } from "./model"

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
							logs: true,
							status: true,
							volunteer: true,
						},
					},
				},
				OfferLog: {
					predicates: {},
					operations: {
						read: allField(model, 'OfferLog', true),
						create: allField(model, 'OfferLog', true),
						update: allField(model, 'OfferLog', true), // TODO: Due to bug in contember: https://github.com/contember/private-issues/issues/74
						// delete: true,
					},
				},
				OfferParameterValue: {
					predicates: {},
					operations: readOnly(model, 'OfferParameterValue', true),
				},
				OfferStatus: {
					predicates: {},
					operations: readOnly(model, 'OfferStatus', true),
				},
				OfferParameter: {
					predicates: {},
					operations: readOnly(model, 'OfferParameter', true),
				},
				OfferParameterDetails: {
					predicates: {},
					operations: readOnly(model, 'OfferParameterDetails', true)
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
					predicates: {
						isAssigned: {
							offers: {
								assignee: {
									personId: 'personId',
								}
							}
						}
					},
					operations: {
						read: {
							...allField(model, 'Volunteer', true),
							email: 'isAssigned',
							phone: 'isAssigned',
						},
						update: {
							tags: true,
						}
					},
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
					operations: {
						read: allField(model, 'VolunteerTag', true),
						update: allField(model, 'VolunteerTag', true),
						create: allField(model, 'VolunteerTag', true),
						delete: true,
					}
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
					predicates: { self: { id: 'volunteerId' } },
					operations: {
						read: allField(model, 'Volunteer', 'self'),
						update: someFields('self', ['userNote', 'expertise', 'districts', 'offers']),
					},
				},
				Offer: {
					predicates: {
						self: { volunteer: { id: 'volunteerId' }, },
					},
					operations: {
						read: allField(model, 'Offer', 'self'),
						update: allField(model, 'Offer', 'self'),
						delete: 'self',
					},
				},
				OfferParameter: {
					predicates: {
						self: { offer: { volunteer: { id: 'volunteerId' } } },
					},
					operations: {
						read: allField(model, 'OfferParameter', 'self'),
						update: allField(model, 'OfferParameter', 'self'),
						delete: 'self',
					},
				},
				OfferParameterValue: {
					predicates: {
						self: { parameter: { offer: { volunteer: { id: 'volunteerId' } } } },
					},
					operations: {
						read: allField(model, 'OfferParameterValue', 'self'),
						update: allField(model, 'OfferParameterValue', 'self'),
						delete: 'self',
					},
				},
				VolunteerLanguage: {
					predicates: {
						self: { volunteer: { id: 'volunteerId' } },
					},
					operations: {
						read: allField(model, 'VolunteerLanguage', 'self'),
						delete: 'self',
					},
				}
			},
		}
	},
})

export default aclFactory
