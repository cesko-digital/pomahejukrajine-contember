import * as React from 'react'
import { ApplicationEntrypoint, LoginEntrypoint, Pages, runReactApp } from '@contember/admin'
import '@contember/admin/style.css'
import { Layout } from './components/Layout'
import { csCZ } from '@contember/admin-i18n'
import { CollaborationClientProvider } from "./utils/collaboration/CollaborationClientProvider"
import * as Sentry from "@sentry/browser";
import "./styles/index.sass"
import { CaptureConsole as CaptureConsoleIntegration } from "@sentry/integrations";

const sentryDsn = import.meta.env.VITE_CONTEMBER_ADMIN_SENTRY_DSN
if (typeof sentryDsn === 'string') {
	Sentry.init({
		dsn: sentryDsn,
		integrations: [new CaptureConsoleIntegration({
			levels: ['error']
		})]
	});
}
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
			envVariables={{
				TYPESENSE_HOST: import.meta.env.VITE_CONTEMBER_ADMIN_TYPESENSE_HOST as string,
				TYPESENSE_PORT: import.meta.env.VITE_CONTEMBER_ADMIN_TYPESENSE_PORT as string,
				TYPESENSE_PROTOCOL: import.meta.env.VITE_CONTEMBER_ADMIN_TYPESENSE_PROTOCOL as string,
			}}
			stage="live"
			defaultLocale={"cs-CZ"}
			dictionaries={{ 'cs-CZ': csCZ }}
		>
			{/* <CollaborationClientProvider> */}
				<Pages
					layout={Layout}
					children={import.meta.glob('./pages/**/*.tsx')}
				/>
			{/* </CollaborationClientProvider> */}
		</ApplicationEntrypoint>,
	)
}
