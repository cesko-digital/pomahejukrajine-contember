import * as React from 'react'
import { ApplicationEntrypoint, LoginEntrypoint, Pages, runReactApp } from '@contember/admin'
import '@contember/admin/style.css'
import { Layout } from './components/Layout'
import { csCZ } from '@contember/admin-i18n'
import { CollaborationClientProvider } from "./utils/collaboration/CollaborationClientProvider"


const apiBaseUrl = import.meta.env.VITE_CONTEMBER_ADMIN_API_BASE_URL as string
const loginTOken = import.meta.env.VITE_CONTEMBER_ADMIN_LOGIN_TOKEN as string
if (window.location.hash === '#login') {
	runReactApp(
		<LoginEntrypoint
			apiBaseUrl={apiBaseUrl}
			loginToken={loginTOken}
			projects={[import.meta.env.VITE_CONTEMBER_ADMIN_PROJECT_NAME]}
			formatProjectUrl={it => `/${it.slug}/`}
		/>,
	)
} else {
	runReactApp(
		<ApplicationEntrypoint
			basePath={import.meta.env.BASE_URL}
			apiBaseUrl={import.meta.env.VITE_CONTEMBER_ADMIN_API_BASE_URL}
			sessionToken={import.meta.env.VITE_CONTEMBER_ADMIN_SESSION_TOKEN}
			project={import.meta.env.VITE_CONTEMBER_ADMIN_PROJECT_NAME}
			stage="live"
			children={
				<CollaborationClientProvider>
					<Pages
						layout={Layout}
						children={Object.assign({}, ...Object.values(import.meta.globEager('./pages/*.tsx')))}
					/>
				</CollaborationClientProvider>
			}
			defaultLocale={"cs-CZ"}
			dictionaries={{ 'cs-CZ': csCZ }}
		/>,
	)
}
