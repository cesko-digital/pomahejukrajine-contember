import React from "react";
import {GenericPage, Link, useAuthedContentQuery, useCurrentRequest, useEnvironment} from "@contember/admin"
import {
	InstantSearch,
	SearchBox,
	Hits,
	Highlight,
	RefinementList,
	CurrentRefinements, Pagination, Stats
} from 'react-instantsearch-dom';
import TypesenseInstantSearchAdapter from "typesense-instantsearch-adapter";
import {QuestionQueryResult} from "../components/OffersGrid";

const LIST_QUESTION_QUERY = `
	query ($id: UUID!) {
		listQuestion(filter: { offerType: { id: { eq: $id } } }) {
			id
			label
			type
			options {
				label
				value
			}
		}
	}
`


function parseIdFromFacetName(facetName: string): string | null {
	const regex = /^parameter_(.*)_facet$/;
	const match = regex.exec(facetName);
	return match ? match[1] : null;
}

export default () => {
	const { state: apiTokenQuery } = useAuthedContentQuery<{ token?: { token: string } }, {}>("{ token: getTypesenseSearchToken(by: { unique: One }) { token } }", {});
	const token = (apiTokenQuery.state === "success" ? apiTokenQuery.data?.token?.token : null) ?? null;

	const env = useEnvironment()

	const req = useCurrentRequest()
	const offerTypeId = req?.parameters.id as string
	const { state: query } = useAuthedContentQuery<QuestionQueryResult, { id: string }>(LIST_QUESTION_QUERY, { id: offerTypeId })

	const searchClient = React.useMemo(() => {
		if (query.state !== "success" || token === null) {
			return null
		}

		const typesenseInstantsearchAdapter = new TypesenseInstantSearchAdapter({
			server: {
				apiKey: token,
				nodes: [
					{
						host: env.getValue("TYPESENSE_HOST"),
						port: parseInt(env.getValue("TYPESENSE_PORT"), 10),
						protocol: env.getValue("TYPESENSE_PROTOCOL"),
					}
				]
			},
			additionalSearchParameters: {
				queryBy: [
					"volunteer_email",
					"volunteer_phone",
					"volunteer_name",
					...query.data.listQuestion.filter(question => !["07d4ee81-3fa1-41df-a5f3-7a1e4c91777f", "8958a3e0-ef6f-4a51-9139-c26b7de8e8ef"].includes(question.id)).map(question => `parameter_${question.id}`),
				].join(',')
			} as any
		});
		return typesenseInstantsearchAdapter.searchClient;
	}, [query, token])

	if (searchClient === null || query.state !== "success") {
		return <></>
	}

	return (
		<GenericPage title={`Hledání nabídek`}>
			<div style={{ display: "flex", flexDirection: "column", gap: "1em" }}>
				<InstantSearch searchClient={searchClient} indexName={`offers_${offerTypeId}`}>
					<SearchBox translations={{ placeholder: "Hledat nabídky" }} />
					<CurrentRefinements transformItems={(it: any[]) => it.map(refinement => ({...refinement, label: query.data.listQuestion.find(it => it.id === parseIdFromFacetName(refinement.attribute))?.label ?? refinement.label }))} />
					<div className="refinements">
						{query.data.listQuestion.filter(it => ['checkbox', 'radio', 'district'].includes(it.type)).map(question => (
							<details>
								<summary>
									<strong>{question.label}</strong>
								</summary>
								<RefinementList
									key={question.id}
									attribute={`parameter_${question.id}_facet`}
									limit={10}
									showMore
									searchable={question.type === "district"}
									translations={{
										showMore: "Více možností",
										placeholder: "Hledat",
										noResults: "Žádné výsledky",
									}}
								/>
							</details>
						))}
					</div>

					<Stats
						translations={{
							stats: (
								n: number,
								ms: number,
								nSorted?: number,
								areHitsSorted?: boolean
							): string =>`${n.toLocaleString()} ${n === 1 ? "výsledek" : (n <= 4 && n > 1) ? "výsledky" : "výsledků"}`,
						}}
					/>

					<Hits hitComponent={(hit) => {
						return (
							<Link to={`editOffer(id:'${hit.hit.id}')`} style={{ color: 'black', flexGrow: 1 }}>
								{query.data.listQuestion.map(question => (
									<div key={question.id}>
										<strong>{question.label}: </strong>
										<span><Highlight attribute={`parameter_${question.id}`} hit={hit.hit} /></span>
									</div>
								))}
								{hit.hit.logs?.length > 0 && <p>
									<strong>Log: </strong>
									<Highlight attribute="logs" hit={hit.hit} />
								</p>}
							</Link>
						)
					}} />
					<div style={{ display: "flex", justifyContent: "center" }}>
						<Pagination />
					</div>
				</InstantSearch>
			</div>
		</GenericPage>
	);
}
