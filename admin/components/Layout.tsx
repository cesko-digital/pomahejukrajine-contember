import * as React from 'react'
import { ReactNode } from 'react'
import { Layout as ContemberLayout } from '@contember/admin'
import { Navigation } from './Navigation'
import './layout.sass'

export const Layout = (props: { children?: ReactNode }) => {
	const [isNavigationOpen, setIsNavigationOpen] = React.useState(true)
	return (
		<ContemberLayout
			sidebarHeader={isNavigationOpen ? "Pomáhej Ukrajině" : undefined}
			navigation={isNavigationOpen ? <Navigation /> : undefined}
			children={
				<>
					<button onClick={() => setIsNavigationOpen(!isNavigationOpen)} className="side-menu-toggle">
						{isNavigationOpen ? <span><span>{'←'}</span> <span className="hidden">hide menu</span></span> : <span><span>{'→'}</span> <span className="hidden">show menu</span></span> }
					</button>
					{props.children}
				</>
			}
		/>
	)
}
