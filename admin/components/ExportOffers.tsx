import {
	Button,
	Component,
	useCurrentContentGraphQlClient,
} from "@contember/admin";
import Papa from "papaparse";
import * as React from "react";
import { QuestionQueryResult } from "./OffersGrid";

const LIST_LIST_OFFER_QUERY = `
	query($filter: OfferWhere){
		listOffer(filter: $filter, orderBy: { volunteer: { createdAt: desc } }) {
			code
			createdAt
			updatedAt
			assignees {
				name
			}
			status {
				name
			}
			type {
				name
			}
			internalNote
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
					label
				}
				value
				specification
				values {
					value
					specification
					district {
						name
						region {
							name
						}
					}
				}
			}
		}
	}
`;

type ListOfferQueryResult = {
	listOffer: Offer[];
};

type Offer = {
	code: string;
	createdAt: Date;
	updatedAt: Date;
	assignees: { name: string }[];
	status: { name: string };
	type: { name: string };
	internalNote: string;
	volunteer: {
		name: string;
		email: string;
		phone: string;
		languages: { language: { name: string } }[];
	};
	parameters: {
		question: {
			id: string;
			label: string;
		};
		value: string;
		specification: string;
		values: {
			value: string;
			specification: string;
			district: { name: string; region: { name: string } };
		}[];
	}[];
};

function parseJSON(json: string) {
	try {
		var parsedText = "";
		var parsedJSON = JSON.parse(json);
		for (var text in parsedJSON.children) {
			parsedText += parsedJSON.children[text].text
				? parsedJSON.children[text].text
				: "";
		}
		return parsedText;
	} catch (e) {
		return null;
	}
}

export const ExportOffers = Component<{
	dataGridProps: any;
	listQuestion: QuestionQueryResult["listQuestion"];
}>(
	({ dataGridProps, listQuestion }) => {
		const client = useCurrentContentGraphQlClient();
		const [prepareDownload, setPrepareDownload] =
			React.useState<boolean>(false);
		const [offers, setOffers] = React.useState<any>(null);
		const [objectUrl, setObjectUrl] = React.useState<string>();
		const handler = React.useCallback(async () => {
			return await client.sendRequest<ListOfferQueryResult>(
				LIST_LIST_OFFER_QUERY,
				{
					variables: {
						filter: {
							...dataGridProps.entities.filter,
							...dataGridProps.state.filter,
						},
					},
				}
			);
		}, [client]);

		React.useEffect(() => {
			if (offers) {
				const csv = offers.data?.listOffer?.map((offer: Offer) => {
					return [
						offer.volunteer.email,
						...listQuestion
							.flatMap((question) => {
								const parameter = offer.parameters.find((parameter) => parameter.question.id === question.id);
								if (["district"].includes(question.type)) {
									return [
										parameter?.values.map((value) => value.value).join(", "),
										parameter?.values.map((value) => value?.district?.region?.name).join(", "),
									];
								}
							})
							.filter((item) => item !== null),
						offer.code,
						offer.createdAt,
						offer.updatedAt,
						offer.assignees
							.map((assignee: { name: string }) => assignee.name)
							.join(", "),
						offer.status?.name,
						offer.volunteer.languages
							.map((language) => language.language.name)
							.join(", "),
						...listQuestion
							.flatMap((question) => {
								const parameter = offer.parameters.find((parameter) => parameter.question.id === question.id);
								if (
									["text", "textarea", "date", "radio", "number"].includes(
										question.type
									)
								) {
									if (!parameter) {
										return [];
									}
									return parameter.specification
										? `${parameter.value} (${parameter.specification})`
										: parameter.value;
								} else if (["checkbox"].includes(question.type)) {
									return parameter?.values.map((value) => [value.value, value.specification ?? ''])[0];
								}	else {
									return null;
								}
							})
							.filter((item) => item !== null),
						parseJSON(offer.internalNote),
					];
				});

				const firstOffer: Offer = offers.data?.listOffer[0]
				csv.unshift([
					'Dobrovolník e-mail',
					'Okres',
					'Kraj',
					'Kód nabídky',
					'Datum vložení nabídky',
					'Datum poslední úpravy nabídky',
					'Přiřazen',
					'Stav nabídky',
					'Dobrovolník jazyky',
					...listQuestion
							.flatMap((question) => {
								const parameter = firstOffer.parameters.find((parameter) => parameter.question.id === question.id);
								if (
									["text", "textarea", "date", "radio", "number"].includes(
										question.type
									)
								) {
									if (!parameter) {
										return [];
									}
									return parameter.question.label;
								} else if (["checkbox"].includes(question.type)) {
									return parameter?.values ? [parameter.question.label, `${parameter.question.label} specifikace`] : [];
								} else {
									return null;
								}
							})
				])

				const myCsv = Papa.unparse(csv, { delimiter: ';', quotes: true });
				const blob = new Blob([myCsv], { type: "text/csv;charset=utf-8;" });
				const url = URL.createObjectURL(blob);
				setObjectUrl(url);
				return () => {
					URL.revokeObjectURL(url);
				};
			}
		}, [offers]);

		if (objectUrl) {
			return (
				<a href={objectUrl} download="offers.csv">
					<Button distinction="outlined">Stáhnout</Button>
				</a>
			);
		} else {
			return (
				<Button
					onClick={async () => {
						setPrepareDownload(true);
						setTimeout(async () => setOffers(await handler()), 1500);
					}}
					distinction="outlined"
					loading={prepareDownload}
				>
					Export
				</Button>
			);
		}
	},
	() => null,
	"ExportOffers"
);
