import createCachedSelector from 're-reselect'

import getMonthData from './workdata'

export default createCachedSelector(
	year => year,
	(year, month) => month,
	(year, month, is6_4Model) => is6_4Model,

	(year, month, is6_4Model) => getMonthData(year, month, is6_4Model)
)(
	(year, month, is6_4Model) => `${year}-${month}-${is6_4Model}`
)
