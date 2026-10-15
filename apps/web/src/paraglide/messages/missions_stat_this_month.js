/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Missions_Stat_This_MonthInputs */

const en_missions_stat_this_month = /** @type {(inputs: Missions_Stat_This_MonthInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`This month`)
};

const fr_missions_stat_this_month = /** @type {(inputs: Missions_Stat_This_MonthInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ce mois`)
};

/**
* | output |
* | --- |
* | "This month" |
*
* @param {Missions_Stat_This_MonthInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const missions_stat_this_month = /** @type {((inputs?: Missions_Stat_This_MonthInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Missions_Stat_This_MonthInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_missions_stat_this_month(inputs)
	return en_missions_stat_this_month(inputs)
});