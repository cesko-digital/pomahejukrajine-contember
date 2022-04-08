import { SchemaDefinition as def } from '@contember/schema-definition'
import { OfferParameterValue, OfferParameterValueDetails } from './Offer'
import { Region } from './Region'
import { VolunteerDistrict } from './Volunteer'

export class District { // Okres
	region = def.manyHasOne(Region, 'districts').notNull()
	name = def.stringColumn().notNull().unique()
	volunteers = def.oneHasMany(VolunteerDistrict, 'district')
	offerParameterValues = def.oneHasMany(OfferParameterValueDetails, 'district')
	offers = def.oneHasMany(OfferParameterValue, 'district')
}