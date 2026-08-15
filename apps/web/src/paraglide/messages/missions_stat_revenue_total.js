/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Missions_Stat_Revenue_TotalInputs */

const en_missions_stat_revenue_total = /** @type {(inputs: Missions_Stat_Revenue_TotalInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Total revenue`)
};

const fr_missions_stat_revenue_total = /** @type {(inputs: Missions_Stat_Revenue_TotalInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`CA cumulé`)
};

/**
* | output |
* | --- |
* | "Total revenue" |
*
* @param {Missions_Stat_Revenue_TotalInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const missions_stat_revenue_total = /** @type {((inputs?: Missions_Stat_Revenue_TotalInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Missions_Stat_Revenue_TotalInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_missions_stat_revenue_total(inputs)
	return en_missions_stat_revenue_total(inputs)
});