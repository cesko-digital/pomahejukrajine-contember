import {
	Field,
	GenericPage,
	NavigateBackButton,
	DataBindingProvider,
	FeedbackRenderer,
	EntitySubTree,
	DateFieldView,
	FieldView,
	HasOne,
	Link,
} from "@contember/admin";
import * as React from "react";

export default (
	<GenericPage
		title="Detail reakce"
		navigation={
			<NavigateBackButton to="reactionList">
				Zpět na přehled projektů
			</NavigateBackButton>
		}
	>
		<DataBindingProvider stateComponent={FeedbackRenderer}>
			<EntitySubTree entity="Reaction(id = $id)">
				<div className="volunteer-wrapper">
					<table>
						<tr>
							<td>Vytvořeno</td>
							<td>
								<DateFieldView field="createdAt" />
							</td>
						</tr>
						<tr>
							<td>E-mail</td>
							<td>
								<Field field="email" />
							</td>
						</tr>
						<tr>
							<td>Telefon</td>
							<td>
								<Field field="phone" />
							</td>
						</tr>
						<tr>
							<td>Zpráva</td>
							<td>
								<FieldView field="text" render={(field) => field.value} />
							</td>
						</tr>
						<tr>
							<td>Nabídka</td>
							<td>
								<HasOne field="offer">
									<FieldView
										fields={["code", "name"]}
										render={({ value: code }, { value: name }) => (
											<Link to="editOffer(id: $entity.id)">{`${name} ${
												code ? `(${code})` : ""
											}`}</Link>
										)}
									/>
								</HasOne>
							</td>
						</tr>
						<tr>
							<td>Tajný kód</td>
							<td>
								<Field field="secretCode" />
							</td>
						</tr>
						<tr>
							<td>Ověřeno</td>
							<td>
								<FieldView
									field="verified"
									render={(field) => (field.value ? "Ano" : "Ne")}
								/>
							</td>
						</tr>
						<tr>
							<td>Dobrovolník notifikován</td>
							<td>
								<FieldView
									field="volunteerNotified"
									render={(field) => (field.value ? "Ano" : "Ne")}
								/>
							</td>
						</tr>
					</table>
				</div>
			</EntitySubTree>
		</DataBindingProvider>
	</GenericPage>
);
