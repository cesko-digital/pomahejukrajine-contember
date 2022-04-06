import * as React from 'react'
import { DataGridPage } from '@contember/admin'
import { GridContent } from '../forms/demandGrid'

export default (
	<DataGridPage
		entities="Demand[solved=true]"
		rendererProps={{ title: 'Seznam žádostí' }}
	>
		<GridContent />
	</DataGridPage>
)
