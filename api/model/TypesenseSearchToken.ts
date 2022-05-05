import {SchemaDefinition as def} from "@contember/schema-definition";

export class TypesenseSearchToken {
	unique = def.enumColumn(def.createEnum('One')).notNull().unique()
	token = def.stringColumn().notNull()
}
