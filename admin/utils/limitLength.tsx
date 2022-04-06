import * as React from 'react'

export const limitLength = (maxLength: number, makeSmaller = false) => (value: any) => {
	if (makeSmaller) {
		if (value.length > maxLength) {
			return <span style={{ width: '300px', display: 'block', whiteSpace: 'normal', fontSize: '12px' }} title={value}>{value}</span>
		}
	} else {
		if (typeof value === 'string' && value.length > maxLength) {
			return <span title={value}>{value.substr(0, maxLength) + '…'}</span>
		}
		return value
	}
}
