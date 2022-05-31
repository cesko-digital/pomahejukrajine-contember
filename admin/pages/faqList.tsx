import { MultiEditPage, PersistButton, TextAreaField, TextField } from '@contember/admin'
import * as React from 'react'

export default (
	<MultiEditPage entities="FrequentlyAskedQuestion" rendererProps={{ sortableBy: "order", title: "Často kladené otázky", actions: <PersistButton /> }}>
        <TextField field="question" label="Otázka" />
        <TextField field="questionUA" label="Otázka v Ukrajinštině" />
        <TextAreaField field="answer" label="Odpověď" />
        <TextAreaField field="answerUA" label="Odpověď v Ukrajinštině" />
	</MultiEditPage>
)

