import {
	Button,
	Checkbox,
	Component,
	DateInput,
	Entity,
	EntityAccessor,
	EntityListSubTree,
	EntitySubTree,
	EntityView,
	Field,
	FieldContainer,
	FieldView,
	HasMany,
	HasOne,
	If,
	ImageUploadField,
	Link,
	NumberInput,
	Radio,
	Repeater,
	SelectField,
	Stack,
	TextareaField,
	TextareaInput,
	TextField,
	useEntityBeforePersist,
	useEntityList,
	useEntityListSubTree,
	useIdentity,
} from "@contember/admin";
import { Conditional } from "./Conditional";
import * as React from "react";
import Select from "react-select";
import { RoleConditional } from './RoleConditional'

type OfferParametersFormProps = {
	currentType?: boolean;
};

type CurrentTypeProps = {
	currentType?: boolean;
	children: React.ReactNode;
};

const CurrentType = Component<CurrentTypeProps>((props) => {
	if (props.currentType) {
		return (
			<EntitySubTree entity={`OfferType(offers.id = $id)`}>
				<HasMany field="questions" orderBy="order">
					{props.children}
				</HasMany>
			</EntitySubTree>
		);
	}
	return (
		<HasMany field="type.questions" orderBy="order">
			{props.children}
		</HasMany>
	);
}, "CurrentType");

export const OfferParametersForm = Component<OfferParametersFormProps>(
	({ currentType }) => {
		const parameters = useEntityList("parameters");
		const districts = useEntityListSubTree("districts");

		const getParameterEntity = (
			question: EntityAccessor
		): EntityAccessor | undefined => {
			const parameter = Array.from(parameters).find(
				(parameter) =>
					parameter.getEntity("question").idOnServer === question.idOnServer
			);
			return parameter;
		};

		const setParameter = (
			question: EntityAccessor,
			value: string | number | null | undefined,
			field:
				| "value"
				| "specification"
				| "numericValue"
				| "valueUK"
				| "specificationUK" = "value"
		) => {
			const parameter = getParameterEntity(question);

			if (parameter) {
				parameter.getField<string | number>(field).updateValue(value ?? null);
			} else {
				parameters.createNewEntity((getAccessor) => {
					getAccessor().connectEntityAtField("question", question);
					getAccessor()
						.getField(field)
						.updateValue(value ?? null);
				});
			}
		};

		const getParameter = <T extends string | number = string>(
			question: EntityAccessor,
			field: "value" | "specification" | "valueUK" = "value"
		): T | null => {
			return getParameterEntity(question)?.getField<T>(field).value ?? null;
		};

		const setParameters = (question: EntityAccessor, value: string[]) => {
			let parameter = getParameterEntity(question);
			if (!parameter) {
				parameters.createNewEntity((getAccessor) => {
					getAccessor().connectEntityAtField("question", question);
					parameter = getAccessor();
				});
			}
			const optionsList = parameter?.getEntityList("values");
			const options = Array.from(optionsList ?? []);
			const remove = options.filter(
				(option) =>
					!value.includes(option.getField<string>("value").value ?? "")
			);
			const add = value.filter(
				(value) =>
					!options.find(
						(option) => option.getField<string>("value").value === value
					)
			);
			for (const option of remove) {
				option.deleteEntity();
			}
			for (const value of add) {
				optionsList?.createNewEntity((getAccessor) => {
					getAccessor().getField("value").updateValue(value);
					getAccessor().connectEntityAtField(
						"district",
						Array.from(districts).find(
							(district) => district.getField<string>("name").value === value
						)!
					);
				});
			}
		};

		const toggleParameter = (
			question: EntityAccessor,
			value: string,
			add: boolean
		) => {
			const updateParameter = (parameter: EntityAccessor) => {
				const valuesEntityList = parameter.getEntityList("values");
				const currentOptions = Array.from(valuesEntityList ?? []).map(
					(option) => option.getField<string>("value").value!
				);
				if (add) {
					if (!currentOptions.includes(value)) {
						valuesEntityList?.createNewEntity((getAccessor) => {
							getAccessor().getField("value").updateValue(value);
						});
					}
				} else {
					if (currentOptions.includes(value)) {
						const option = Array.from(valuesEntityList ?? []).find(
							(option) => option.getField<string>("value").value === value
						);
						option?.deleteEntity();
					}
				}
			};
			const parameter = getParameterEntity(question);
			if (parameter !== undefined) {
				updateParameter(parameter);
			} else {
				parameters.createNewEntity((getAccessor) => {
					getAccessor().connectEntityAtField("question", question);
					updateParameter(getAccessor());
				});
			}
		};

		const getParameterValues = (question: EntityAccessor): string[] => {
			const parameter = getParameterEntity(question);
			return Array.from(parameter?.getEntityList("values") ?? []).map(
				(option) => option.getField<string>("value").value!
			);
		};

		const getParameters = (
			question: EntityAccessor,
			value: string
		): boolean => {
			const parameter = getParameterEntity(question);
			const option = Array.from(parameter?.getEntityList("values") ?? []).find(
				(option) => option.getField<string>("value").value === value
			);
			return option !== undefined;
		};

		const getParametersSpecification = (
			question: EntityAccessor,
			value: string,
			field: "specification" | "specificationUK" = "specification"
		): string | null => {
			const parameter = getParameterEntity(question);
			const option = Array.from(parameter?.getEntityList("values") ?? []).find(
				(option) => option.getField<string>("value").value === value
			);
			return option?.getField<string>(field).value ?? null;
		};

		const setParametersSpecification = (
			question: EntityAccessor,
			value: string,
			specification: string,
			field: "specification" | "specificationUK" = "specification"
		) => {
			const parameter = getParameterEntity(question);
			const option = Array.from(parameter?.getEntityList("values") ?? []).find(
				(option) => option.getField<string>("value").value === value
			);
			option?.getField<string>(field).updateValue(specification);
		};

		const questions = useEntityList({
			field: "type.questions",
			orderBy: "order",
		});

		const [_, setState] = React.useState<number>(0);
		React.useEffect(() => {
			for (const question of questions) {
				const parameter = Array.from(parameters).find(
					(parameter) =>
						parameter.getEntity("question").idOnServer === question.idOnServer
				);
				if (!parameter) {
					parameters.createNewEntity((getAccessor) => {
						getAccessor().connectEntityAtField("question", question);
					});

					setState((state) => state + 1);
				}
			}
		});

		return (
			<>
				{!currentType && (
					<div style={{ maxWidth: "770px" }}>
						<SelectField
							label="Typ nabídky"
							field="type"
							options="OfferType"
							renderOption={(option) => {
								const infoText = option.getField<string>("infoText").value;
								return (
									option.getField("name").value +
									(infoText ? ` (${infoText})` : "")
								);
							}}
							optionsStaticRender={
								<>
									<Field field="name" />
									<Field field="infoText" />
									<HasMany field="questions" orderBy="order">
										<Field field="question" />
										<Field field="required" />
										<Field field="type" />
										<HasMany field="options">
											<Field field="label" />
											<Field field="requireSpecification" />
										</HasMany>
									</HasMany>
								</>
							}
						/>
					</div>
				)}
				<Conditional showIf={(acc) => acc.getEntity("type").existsOnServer}>
					<CurrentType currentType={currentType}>
						<FieldContainer
							useLabelElement={false}
							label={
								<>
									<Field field="question" />{" "}
									<Field
										field="required"
										format={(r) => (r ? "(povinné)" : "(nepovinné)")}
									/>
								</>
							}
						>
							<Conditional
								showIf={(acc) => acc.getField("type").value === "text"}
							>
								<EntityView
									render={(entity) => (
										<Stack direction="horizontal">
											<TextareaInput
												value={getParameter(entity) as string}
												onChange={(value) =>
													setParameter(entity, value ?? null)
												}
											/>
											<TextareaInput
												value={getParameter<string>(entity, "valueUK")}
												onChange={(value) =>
													setParameter(entity, value ?? null, "valueUK")
												}
											/>
										</Stack>
									)}
								/>
							</Conditional>

							<Conditional
								showIf={(acc) => acc.getField("type").value === "textarea"}
							>
								<EntityView
									render={(entity) => (
										<Stack direction="horizontal">
											<TextareaInput
												value={getParameter<string>(entity)}
												onChange={(value) => setParameter(entity, value)}
											/>
											<TextareaInput
												value={getParameter<string>(entity, "valueUK")}
												onChange={(value) =>
													setParameter(entity, value, "valueUK")
												}
											/>
										</Stack>
									)}
								/>
							</Conditional>

							<Conditional
								showIf={(acc) => acc.getField("type").value === "date"}
							>
								<EntityView
									render={(entity) => (
										<DateInput
											value={getParameter(entity) as string}
											onChange={(value) => setParameter(entity, value ?? null)}
										/>
									)}
								/>
							</Conditional>

							<Conditional
								showIf={(acc) => acc.getField("type").value === "number"}
							>
								<EntityView
									render={(entity) => {
										return (
											<NumberInput
												value={getParameter<number>(entity)}
												onChange={(next) => {
													setParameter(entity, next?.toString());
													setParameter(entity, next, "numericValue");
												}}
											/>
										);
									}}
								/>
							</Conditional>

							<Conditional
								showIf={(acc) => acc.getField("type").value === "radio"}
							>
								<EntityView
									render={(entity) => (
										<>
											<Radio
												value={getParameter(entity) as string}
												options={Array.from(
													entity.getEntityList("options"),
													(option) => ({
														label: option.getField<string>("label").value!,
														value: option.getField<string>("value").value!,
													})
												)}
												onChange={(value) => setParameter(entity, value)}
											/>
											{Array.from(entity.getEntityList("options"))
												.find(
													(it) =>
														it.getField<string>("value").value ===
														getParameter(entity)
												)
												?.getField<boolean>("requireSpecification").value! && (
												<TextareaInput
													value={
														getParameter(entity, "specification") as string
													}
													onChange={(value) =>
														setParameter(entity, value ?? null, "specification")
													}
												/>
											)}
										</>
									)}
								/>
							</Conditional>

							<Conditional
								showIf={(acc) => acc.getField("type").value === "checkbox"}
							>
								<Stack direction={"vertical"}>
									<EntityView
										render={(questionEntity) =>
											Array.from(questionEntity.getEntityList("options")).map(
												(optionEntity) => {
													const value =
														optionEntity.getField<string>("value").value!;
													return (
														<Entity accessor={optionEntity} key={value}>
															<FieldContainer
																label={<Field field="label" />}
																labelPosition="labelInlineRight"
															>
																<Checkbox
																	notNull
																	value={getParameters(questionEntity, value)}
																	onChange={(checked) =>
																		toggleParameter(
																			questionEntity,
																			value,
																			!!checked
																		)
																	}
																/>
															</FieldContainer>
															{optionEntity.getField<boolean>(
																"requireSpecification"
															).value && (
																<Stack direction="horizontal">
																	<TextareaInput
																		notNull
																		value={getParametersSpecification(
																			questionEntity,
																			value
																		)}
																		onChange={(nextValue) => {
																			if (nextValue) {
																				setParametersSpecification(
																					questionEntity,
																					value,
																					nextValue
																				);
																			}
																		}}
																	/>
																	<TextareaInput
																		notNull
																		value={getParametersSpecification(
																			questionEntity,
																			value,
																			"specificationUK"
																		)}
																		onChange={(nextValue) => {
																			if (nextValue) {
																				setParametersSpecification(
																					questionEntity,
																					value,
																					nextValue,
																					"specificationUK"
																				);
																			}
																		}}
																	/>
																</Stack>
															)}
														</Entity>
													);
												}
											)
										}
									/>
								</Stack>
							</Conditional>

							<Conditional
								showIf={(acc) => acc.getField("type").value === "district"}
							>
								<EntityView
									render={(entity) => {
										const options = Array.from(districts).map((district) => ({
											label: district.getField<string>("name").value!,
											value: district.getField<string>("name").value!,
										}));

										return (
											<Select
												isMulti
												closeMenuOnSelect={false}
												value={options.filter((it) => {
													return getParameterValues(entity).includes(it.value);
												})}
												onChange={(value) => {
													setParameters(
														entity,
														value.map((it) => it.value)
													);
												}}
												options={options}
											/>
										);
									}}
								/>
							</Conditional>

							<Conditional
								showIf={(acc) => acc.getField("type").value === "image"}
							>
								<EntityView
									render={(entity) => {
										const removeImage = React.useCallback(() => {
											const value =
												getParameterEntity(entity)?.getField("value");
											value?.updateValue(null);
										}, [entity]);
										return getParameterEntity(entity) ? (
											<Entity accessor={getParameterEntity(entity)!}>
												<ImageUploadField urlField="value" label={undefined} />
												<Stack direction="horizontal" justify="space-between">
													<FieldView<string>
														field="value"
														render={(accessor) =>
															accessor.value && (
																<a href={accessor.value} target="_blank">
																	Otevřít v novém okně
																</a>
															)
														}
													/>
													<If condition="[value != null]">
														<Button
															onClick={removeImage}
															intent="danger"
															distinction="seamless"
														>
															Smazat
														</Button>
													</If>
												</Stack>
											</Entity>
										) : null;
									}}
								/>
							</Conditional>
						</FieldContainer>
					</CurrentType>
				</Conditional>
			</>
		);
	},
	({ currentType }) => (
		<>
			<EntityListSubTree entities="District" alias="districts">
				<Field field="name" />
			</EntityListSubTree>
			{currentType && (
				<EntitySubTree entity={`OfferType(offers.id = $id)`}>
					<HasMany field="questions" orderBy="order">
						<Field field="question" />
						<Field field="required" />
						<Field field="type" />
						<HasMany field="options">
							<Field field="label" />
							<Field field="value" />
							<Field field="requireSpecification" />
						</HasMany>
					</HasMany>
				</EntitySubTree>
			)}
			<SelectField
				label="Typ nabídky"
				field="type"
				options="OfferType"
				renderOption={(option) => {
					const infoText = option.getField<string>("infoText").value;
					return (
						option.getField("name").value + (infoText ? ` (${infoText})` : "")
					);
				}}
				optionsStaticRender={
					<>
						<Field field="name" />
						<Field field="infoText" />
						<HasMany field="questions" orderBy="order">
							<Field field="question" />
							<Field field="required" />
							<Field field="type" />
							<HasMany field="options">
								<Field field="label" />
								<Field field="value" />
								<Field field="requireSpecification" />
							</HasMany>
						</HasMany>
					</>
				}
			/>
			<HasMany field="type.questions" orderBy="order">
				<Field field="question" />
				<Field field="required" />
				<Field field="type" />
				<HasMany field="options">
					<Field field="label" />
					<Field field="value" />
					<Field field="requireSpecification" />
				</HasMany>
			</HasMany>
			<HasMany field="parameters">
				<HasOne field="question" isNonbearing />
				<Field field="value" />
				<Field field="valueUK" />
				<Field field="numericValue" />
				<Field field="specification" />
				<Field field="specificationUK" />
				<HasMany field="values">
					<Field field="value" />
					<Field field="valueUK" />
					<Field field="specification" />
					<Field field="specificationUK" />
					<HasOne field="district">
						<Field field="name" />
					</HasOne>
				</HasMany>
			</HasMany>
		</>
	),
	"OfferForm"
);

const dateFormat = new Intl.DateTimeFormat("cs", {
	timeStyle: "short",
	dateStyle: "full",
});

const LogForm = Component(
	() => {
		const identity = useIdentity();

		useEntityBeforePersist((getEntity, opts) => {
			const managers = opts.getEntityListSubTree({
				entities: "OrganizationManager",
			});
			const manager = Array.from(managers).find(
				(it) => it.getField("personId").value === identity.personId
			);

			if (manager) {
				for (const entity of getEntity().getEntityList({
					field: "logs",
					orderBy: "createdAt",
				})) {
					if (!entity.existsOnServer && entity.hasUnpersistedChanges) {
						entity.connectEntityAtField("author", manager);
					}
				}
			}
		});

		return (
			<>
				<div>
					Pokud s nabídkou jakkoli pracujete, zanechte prosím o tom zde v logu
					zprávu.
				</div>
				<Repeater
					label="Log"
					field="logs"
					orderBy="createdAt"
					enableRemoving={false}
				>
					<Conditional showIf={(it) => it.existsOnServer}>
						<strong>
							<FieldView
								field="createdAt"
								render={(date) =>
									dateFormat.format(new Date(date.value as string))
								}
							/>
							, <Field field="author.name" /> (
							<Field field="author.organization.name" />)
						</strong>
						<p style={{ margin: 0 }}>
							<Field
								field="text"
								format={(it) =>
									(it as string)?.split("\n").map((it) => (
										<>
											{it}
											<br />
										</>
									))
								}
							/>
						</p>
					</Conditional>
					<Conditional showIf={(it) => !it.existsOnServer}>
						<TextareaField field="text" label={null} />
					</Conditional>
				</Repeater>
				<div>
					(Zpráva se neukládá automaticky, uložíte ji tlačítkem Save vpravo
					nahoře.)
				</div>
			</>
		);
	},
	() => {
		return (
			<>
				<Repeater
					label="Log"
					field="logs"
					orderBy="createdAt"
					enableRemoving={false}
				>
					<Field field="author.name" />
					<Field field="author.organization.name" />
					<Field field="createdAt" />
					<TextareaField field="text" label={null} />
					<Field field="author.id" />
				</Repeater>
				<EntityListSubTree entities="OrganizationManager">
					<Field field="personId" />
					<Field field="name" />
					<Field field="organization.name" />
				</EntityListSubTree>
			</>
		);
	}
);

export const OfferForm = Component(
	() => {
		return (
			<>
				<SelectField
					label="Stav nabídky"
					options="OfferStatus.name"
					field="status"
					allowNull
				/>
				<FieldContainer label="Datum poslední úpravy nabídky">
					<FieldView
						field="updatedAt"
						render={(date) => dateFormat.format(new Date(date.valueOnServer as string))}
					/>
				<EntityView
					render={(entity) => 
							<RoleConditional role={["admin", "organizationAdmin"]}>
								<FieldContainer
									label="Zaznamenat datum aktualizace nabídky"
									labelPosition="labelInlineRight"
								>
									<Checkbox
										onChange={(value) => {
											value
												? entity
														.getField("updatedAt")
														.updateValue('now')
												: entity
														.getField("updatedAt")
														.updateValue(
															entity.getField("updatedAt").valueOnServer
														);
										}}
										value={undefined}
										defaultChecked={false}
									/>
								</FieldContainer>
							</RoleConditional>
					}
				/>
				</FieldContainer>
				<FieldContainer label="Datum vložení nabídky">
					<FieldView
						field="createdAt"
						render={(date) => dateFormat.format(new Date(date.value as string))}
					/>
				</FieldContainer>
				<LogForm />
				<div>
					<h2>Nabídka</h2>
					<Stack direction="vertical">
						<If condition={(entity) => entity.existsOnServer}>
							<Link to="editOffer(id: $entity.id)">
								Přejít na detail nabídky
							</Link>
						</If>
						<Field
							field="isDeleted"
							format={(r) =>
								r ? <div className="deleted-offer">Nabídka smazána</div> : ""
							}
						/>
						Kód: <Field field="code" />
						<Stack direction="horizontal">
							<TextField label="Název nabídky" field="name" />
							<TextField label="Název nabídky v Ukrajinštině" field="nameUK" />
						</Stack>
						<OfferParametersForm />
					</Stack>
				</div>
			</>
		);
	},
	"OfferForm"
);
