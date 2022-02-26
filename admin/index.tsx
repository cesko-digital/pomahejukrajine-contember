import * as React from 'react'
import { ApplicationEntrypoint, Pages, runReactApp } from '@contember/admin'
import '@contember/admin/style.css'
import { Layout } from './components/Layout'
import { csCZ } from '@contember/admin-i18n'

runReactApp(
	<ApplicationEntrypoint
		basePath={import.meta.env.BASE_URL}
		apiBaseUrl={import.meta.env.VITE_CONTEMBER_ADMIN_API_BASE_URL}
		sessionToken={import.meta.env.VITE_CONTEMBER_ADMIN_SESSION_TOKEN}
		project={import.meta.env.VITE_CONTEMBER_ADMIN_PROJECT_NAME}
		stage="live"
		children={
			<Pages
				layout={Layout}
				children={Object.assign({}, ...Object.values(import.meta.globEager('./pages/*.tsx')))}
			/>
		}
		defaultLocale={"cs-CZ"}
		dictionaries={{ 'cs-CZ': csCZ }}
	/>,
)
