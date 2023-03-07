import { SchemaDefinition as def } from '@contember/schema-definition'
import { OfferParameterValue, OfferParameterValueDetails } from './Offer'
import { Organization } from './Organization'
import { Region } from './Region'
import { VolunteerDistrict } from './Volunteer'

export class District { // Okres
	region = def.manyHasOne(Region, 'districts').notNull()
	name = def.stringColumn().notNull().unique()
	nameUK = def.stringColumn().notNull().unique().default('')
	volunteers = def.oneHasMany(VolunteerDistrict, 'district')
	offerParameterValues = def.oneHasMany(OfferParameterValueDetails, 'district')
	offers = def.oneHasMany(OfferParameterValue, 'district')
	organizations = def.manyHasManyInverse(Organization, 'districts')
}
