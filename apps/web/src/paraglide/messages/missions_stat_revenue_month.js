/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Missions_Stat_Revenue_MonthInputs */

const en_missions_stat_revenue_month = /** @type {(inputs: Missions_Stat_Revenue_MonthInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Revenue this month`)
};

const fr_missions_stat_revenue_month = /** @type {(inputs: Missions_Stat_Revenue_MonthInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`CA ce mois`)
};

/**
* | output |
* | --- |
* | "Revenue this month" |
*
* @param {Missions_Stat_Revenue_MonthInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const missions_stat_revenue_month = /** @type {((inputs?: Missions_Stat_Revenue_MonthInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Missions_Stat_Revenue_MonthInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_missions_stat_revenue_month(inputs)
	return en_missions_stat_revenue_month(inputs)
});