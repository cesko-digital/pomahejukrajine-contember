import * as React from 'react'
import { Menu, EntityListSubTree, FieldView, DataBindingProvider, FeedbackRenderer, LogoutLink } from '@contember/admin'
import { RoleConditional } from './RoleConditional'
import { UserBox } from './userBox'

export const Navigation = () => (
	<Menu>
		<Menu.Item>
			<UserBox />
		</Menu.Item>
		<RoleConditional notOtherRole={['volunteer']}>
			<Menu.Item title="Dobrovolníci">
				<Menu.Item title="Seznam" to="volunteers" />
				<RoleConditional role={['admin', 'organizationAdmin']}>
					<Menu.Item title="Registrovat" to="newVolunteer" />
				</RoleConditional>
			</Menu.Item>
			<Menu.Item title="Nabídky">
				<DataBindingProvider stateComponent={FeedbackRenderer}>
					<EntityListSubTree entities="OfferType" orderBy="order">
						<FieldView
							fields={["name", "id"]}
							render={({ value: name }, { value: id }) => (
								<Menu.Item title={name} to={{ pageName: "offers", parameters: { id, name } }} />
							)}
						/>
					</EntityListSubTree>
				</DataBindingProvider>
				<RoleConditional role={['admin']}>
					<Menu.Item title="Přehled čerpání nabídek" to="offerListByOrganization" />
				</RoleConditional>
			</Menu.Item>
			<RoleConditional role={['admin', 'organizationAdmin']}>
				<Menu.Item title="Nastavení">
					<Menu.Item title="Přehled reakcí" to="reactionList" />
					<Menu.Item title="Typy nabídek" to="offerTypes" />
					<Menu.Item title="Tagy dobrovolníků" to="tags" />
					<Menu.Item title="Kraje" to="districts" />
					<Menu.Item title="Jazyky" to="languages" />
					<Menu.Item title="Organizace" to="organizations" />
					<Menu.Item title="Pracovníci" to="organizationManagerList" />
					<Menu.Item title="Stavy" to="status" />
					<RoleConditional role={['admin']}>
						<Menu.Item title="Často kladené otázky" to="faqList" />
					</RoleConditional>
				</Menu.Item>
			</RoleConditional>
		</RoleConditional>
		<Menu.Item title="Uživatel">
			<Menu.Item title="Změnit heslo" href="/_panel/security" />
			<LogoutLink><Menu.Item title="Odhlásit se" /></LogoutLink>
		</Menu.Item>
	</Menu>
)
