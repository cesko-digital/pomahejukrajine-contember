import * as React from "react"
import { Button, Component, useCurrentContentGraphQlClient } from "@contember/admin"
import Papa from "papaparse"
import { QuestionQueryResult } from "../pages/offer"

const LIST_LIST_OFFER_QUERY = `
	query($filter: OfferWhere){
		listOffer(filter: $filter, orderBy: { volunteer: { createdAt: desc } }) {
			code
			assignees {
				name
			}
			status {
				name
			}
			type {
				name
			}
			volunteer {
				name
				email
				phone
				languages {
					language {
						name
					}
				}
			}
			parameters {
				question {
					id
				}
				value
				details {
					numericValue
				}
				specification
				values {
					value
					specification
				}
			}
		}
	}
`

type ListOfferQueryResult = {
	listOffer: Offer[]
}

type Offer = {
	code: string
	assignees: { name: string }[]
	status: { name: string }
	type: { name: string }
	volunteer: {
		name: string
		email: string
		phone: string
		languages: { language: { name: string } }[]
	}
	parameters: {
		question: {
			id: string
		}
		value: string
		details: {
			numericValue: number
		}
		specification: string
		values: { value: string, specification: string }[]
	}[]
}


export const ExportOffers = Component<{ dataGridProps: any, listQuestion: QuestionQueryResult['listQuestion'] }>(
	({ dataGridProps, listQuestion }) => {
		const client = useCurrentContentGraphQlClient()
		const [prepareDownload, setPrepareDownload] = React.useState<boolean>(false)
		const [offers, setOffers] = React.useState<any>(null)
		const handler = React.useCallback(async () => {
			return await client.sendRequest<ListOfferQueryResult>(LIST_LIST_OFFER_QUERY, { variables: { filter: { ...dataGridProps.entities.filter, ...dataGridProps.state.filter } } })
		}, [client])

		if (offers) {
			const csv = offers.data?.listOffer?.map((offer: Offer) => {
				return ([
					offer.code,
					offer.assignees.map((assignee: { name: string }) => assignee.name).join(', '),
					offer.status?.name,
					offer.volunteer.languages.map(((language) => language.language.name)).join(', '),
					...listQuestion.map(question => {
						if (["text", "textarea", "date", "radio", "number"].includes(question.type)) {
							const parameter = offer.parameters.find(parameter => parameter.question.id === question.id)
							return (
								parameter?.value ? `${parameter} (${parameter.specification})` : parameter?.value
							)
						} else if (["checkbox"].includes(question.type)) {
							return (
								offer.parameters.find(parameter => parameter.question.id === question.id)?.values.map(value => value.specification ? `${value.value} (${value.specification})` : value.value).join(', ')
							)
						} else if (["district"].includes(question.type)) {
							return (
								offer.parameters.find(parameter => parameter.question.id === question.id)?.values.map(value => value.value).join(', ')
							)
						} else {
							return null
						}
					}).filter(item => item !== null),
				])
			})
			const myCsv = Papa.unparse(csv, { delimiter: ';' })
			console.log('myCsv', myCsv)

			const blob = new Blob([myCsv], { type: 'text/csv;charset=utf-8;' })
			return <a href={URL.createObjectURL(blob)} download="offers.csv"><Button distinction="outlined">Stáhnout</Button></a>
		} else {
			return (
				<Button
					onClick={async () => {
						setPrepareDownload(true)
						setTimeout(async () => setOffers(await handler()), 1500)
					}}
					distinction="outlined"
					isLoading={prepareDownload}
				>
					Export
				</Button>
			)
		}
	},
	() => null,
	'ExportOffers'
)
