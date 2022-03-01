export interface JsonObject {
	readonly [property: string]: Json | undefined
}

export type Json =
	| string
	| number
	| boolean
	| null
	| readonly Json[]
	| JsonObject

export function hasOwnProperty<X extends {}, Y extends PropertyKey>
	(obj: X, prop: Y): obj is X & Record<Y, unknown> {
	return obj.hasOwnProperty(prop)
}
