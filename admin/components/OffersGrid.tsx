import * as React from "react";
import {
	BooleanCell,
	ControlledDataGrid,
	DataBindingProvider,
	DateCell,
	FeedbackRenderer,
	Field,
	FieldView,
	GenericCell,
	GenericPage,
	HasManySelectCell,
	HasOneSelectCell,
	LinkButton,
	NumberCell,
	RichTextRenderer,
	TextCell,
	useDataGrid,
} from "@contember/admin";
import { limitLength } from "../utils/limitLength";
import { ExportOffers } from "./ExportOffers";
import { HasManyCell } from "./HasManyCell";
import { HasManyFilterCell } from "./HasManyFilterCell";
import { RoleConditional } from "./RoleConditional";
import { VisitCell } from "./VisitCell";
import { format } from 'date-fns'

export type QuestionQueryResult = {
	listQuestion: {
		id: string;
		label: string;
		type: string;
		options: { label: string; value: string }[];
	}[];
};

const SpecificationValue = ({ entity }: any) => {
	const specification = entity.getField("specification").value;
	if (specification && specification.length > 30) {
		return (
			<span style={{ fontSize: "90%" }}>
				({specification.substr(0, 30) + "…"})
			</span>
		);
	} else if (specification) {
		return <span style={{ fontSize: "90%" }}>({specification})</span>;
	}
	return null;
};

export const OffersGrid = ({
	query,
	offerTypeId,
	offerTypeName,
	personId,
}: {
	query: { data: QuestionQueryResult };
	offerTypeId: string;
	offerTypeName: string;
	personId: string;
}) => {
	const dataGridProps = useDataGrid({
		entities:
			"Offer[type.id=$id][isDeleted=false][volunteer.verified=true][volunteer.banned=false]",
		itemsPerPage: 20,
		children: React.useMemo(
			() => (
				<>
					<GenericCell shrunk>
						<VisitCell personId={personId} />
					</GenericCell>
					<GenericCell canBeHidden={false} shrunk>
						<LinkButton to="editOffer(id: $entity.id)">Otevřít</LinkButton>
					</GenericCell>
					{query.data.listQuestion
						.map((question) => {
							if (["district"].includes(question.type)) {
								return (
									<>
										<HasManyFilterCell
											key={question.id}
											field={`parameters(question.id='${question.id}').values`}
											header={question.label}
											createWhere={(query) => ({
												district: { name: query },
											})}
											render={({ entities }) => (
												<>
													{entities.map((entity) => (
														<React.Fragment key={entity.key}>
															{entity.getField("district.name").value}
															<br />
														</React.Fragment>
													))}
												</>
											)}
										>
											<Field field={`district.name`} />
										</HasManyFilterCell>
										<HasManyCell
											key={question.id}
											field={`parameters(question.id='${question.id}').values`}
											header={
												question.label === "Okres"
													? "Kraj"
													: `${question.label} - Kraj`
											}
											entityList="Region"
											hasOneField="district.region"
											separator=""
										>
											<Field field={`name`} />
											<br />
										</HasManyCell>
									</>
								);
							} else if (question.type === "number") {
								return (
									<NumberCell
										key={question.id}
										field={`details.numericValue`}
										header={question.label}
									/>
								);
							} else {
								return null;
							}
						})
						.filter((item) => item !== null)}
					<HasOneSelectCell
						field="status"
						options="OfferStatus.name"
						header="Status"
					/>
					<TextCell field="code" header="Kód" />
					<DateCell field="createdAt" header="Vytvořeno" format={(date) => format(date, 'dd. MM. y')} />
					<DateCell field="updatedAt" header="Aktualizováno" format={(date) => format(date, 'dd. MM. y')} />
					<HasManySelectCell
						field="assignees"
						header="Přiřazen"
						options={"OrganizationManager.name"}
						renderElements={(els) => (
							<span>
								{els.map((el) => (
									<span style={{ display: "block", fontSize: "90%" }}>
										{el}
									</span>
								))}
							</span>
						)}
					/>
					{/* <GenericCell header="Prohlíží" shrunk>
					<CurrentEntityKeyListener>
						{(data) => (<CollaborationList emails={data?.keys?.map(key => key.client.email) ?? []} />)}
					</CurrentEntityKeyListener>
				</GenericCell> */}
					<HasManyCell
						field="volunteer.languages"
						entityList="Language"
						hasOneField="language"
						header="Dobrovolník: Jazyky"
					>
						<Field field="name" />
					</HasManyCell>
					{query.data.listQuestion
						.map((question) => {
							if (
								["text", "radio", "textarea", "date"].includes(question.type)
							) {
								return (
									<TextCell
										key={question.id}
										field={`parameters(question.id='${question.id}').value`}
										header={question.label}
										hidden={question.type === "textarea"}
										format={limitLength(30, true)}
										disableOrder
									/>
								);
							} else if (["checkbox"].includes(question.type)) {
								return (
									<>
										<HasManyFilterCell
											key={question.id}
											field={`parameters(question.id='${question.id}').values`}
											header={question.label}
											createWhere={(query) => ({ value: query })}
											render={({ entities }) => (
												<>
													{entities
														.map((entity) => entity.getField("value").value)
														.join(", ")}
												</>
											)}
										>
											<Field field={`value`} />
										</HasManyFilterCell>
										<HasManyFilterCell
											key={question.id + "specification"}
											field={`parameters(question.id='${question.id}').values`}
											header={question.label + " specifikace"}
											createWhere={(query) => ({ specification: query })}
											render={({ entities }) => (
												<>
													{entities.map((entity, index) => (
														<SpecificationValue key={index} entity={entity} />
													))}
												</>
											)}
										>
											<Field field={`specification`} />
										</HasManyFilterCell>
									</>
								);
							} else {
								return null;
							}
						})
						.filter((item) => item !== null)}
					<GenericCell header="Interní poznámka">
						<FieldView<string>
							field="internalNote"
							render={(accessor) => (
								<span
									style={{
										width: "300px",
										display: "block",
										whiteSpace: "normal",
										fontSize: "12px",
									}}
								>
									<RichTextRenderer source={accessor.value} />
								</span>
							)}
						/>
					</GenericCell>
					<TextCell
						field="volunteer.email"
						header="Dobrovolník: Email"
						hidden
					/>
					<TextCell
						field="volunteer.phone"
						header="Dobrovolník: Telefon"
						hidden
					/>
					<TextCell
						field="volunteer.expertise"
						header="Dobrovolník: Odbornost"
						hidden
						format={limitLength(30, true)}
					/>
					<HasManySelectCell
						field="volunteer.tags"
						options="VolunteerTag.name"
						header="Dobrovolník: Tagy"
					/>
					<TextCell
						field="volunteer.userNote"
						header="Dobrovolník: Poznámka uživatele"
						hidden
						format={limitLength(30, true)}
					/>
					<TextCell
						field="volunteer.internalNote"
						header="Dobrovolník: Interní poznámka"
						hidden
						format={limitLength(30, true)}
					/>
					<DateCell
						field="volunteer.createdAt"
						header="Dobrovolník: Datum registrace"
						hidden
					/>
					<BooleanCell
						field="volunteer.createdInAdmin"
						header="Dobrovolník: Registrován administrátorem"
						hidden
					/>
					{/*<GenericCell canBeHidden={false} shrunk>*/}
					{/*	<LinkButton to="editVolunteer(id: $entity.volunteer.id)">Dobrovolník</LinkButton>*/}
					{/*</GenericCell>*/}
				</>
			),
			[]
		),
	});

	return (
		<GenericPage
			title={offerTypeName}
			actions={
				<>
					<LinkButton
						to={`offersSearch(id:'${offerTypeId}')`}
						distinction="outlined"
					>
						Hledat
					</LinkButton>
					<RoleConditional role={["admin", "organizationAdmin"]}>
						<ExportOffers
							dataGridProps={dataGridProps}
							listQuestion={query.data.listQuestion}
						/>
					</RoleConditional>
				</>
			}
		>
			<DataBindingProvider stateComponent={FeedbackRenderer}>
				<div className="data-grid-container">
					<ControlledDataGrid {...dataGridProps} />
				</div>
			</DataBindingProvider>
		</GenericPage>
	);
};
