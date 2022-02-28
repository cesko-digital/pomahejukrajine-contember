import * as React from 'react'
import { Component } from "@contember/admin"
import './CollaborationList.sass'

function isDark(color: any) {
	let r, g, b

	color = +(
		"0x" + color.slice(1).replace(
			color.length < 5 && /./g, '$&$&'
		)
	)

	r = color >> 16
	g = color >> 8 & 255
	b = color & 255

	const hsp = Math.sqrt(
		0.299 * (r * r) +
		0.587 * (g * g) +
		0.114 * (b * b)
	)

	if (hsp > 127.5) {
		return false
	}
	else {
		return true
	}
}

function getRandomColor(name: string) {
	const firstAlphabet = name.charAt(0).toLowerCase()
	let hash = 0
	let color = '#'

	for (var i = 0; i < name.length; i++) {
		hash = name.charCodeAt(i) + ((hash << 5) - hash)
	}
	for (var i = 0; i < 3; i++) {
		var value = (hash >> (i * 8)) & 0xFF
		color += ('00' + value.toString(16)).substr(-2)
	}

	return {
		color,
		character: firstAlphabet.toUpperCase(),
		isDark: isDark(color),
	}
}

const Avatar = Component<{ email: string }>(
	(props) => {
		const { color, character, isDark } = getRandomColor(props.email)
		return (
			<div
				className="avatar"
				style={{
					backgroundColor: color,
					color: isDark ? 'white' : 'black',
				}}
				data-title={props.email}
			>
				<span>
					{character}
				</span>
			</div>
		)
	}
)

const MoreAvatars = Component<{ emails: string[] }>(
	({ emails }) => {
		return (
			<div
				className="avatar"
				style={{
					backgroundColor: 'white',
					color: 'black',
				}}
				data-title={emails.join(', ')}
			>
				<span>
					⋯
				</span>
			</div>
		)
	}
)

export interface CollaborationListProps {
	emails: string[]
}

export const CollaborationList = Component<CollaborationListProps>(
	(props) => {
		const [shown, more] = props.emails.length > 3 ? [props.emails.slice(0, 2), props.emails.slice(2)] : [props.emails, []]

		return (
			<div style={{ display: 'flex', gap: '0.25em' }}>
				{shown.map((email) => <Avatar email={email} />)}
				{more.length > 0 && <MoreAvatars emails={more} />}
			</div>
		)
	}
)
