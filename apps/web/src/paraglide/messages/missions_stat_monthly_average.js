/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Missions_Stat_Monthly_AverageInputs */

const en_missions_stat_monthly_average = /** @type {(inputs: Missions_Stat_Monthly_AverageInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Average / month`)
};

const fr_missions_stat_monthly_average = /** @type {(inputs: Missions_Stat_Monthly_AverageInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Moyenne / mois`)
};

/**
* | output |
* | --- |
* | "Average / month" |
*
* @param {Missions_Stat_Monthly_AverageInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const missions_stat_monthly_average = /** @type {((inputs?: Missions_Stat_Monthly_AverageInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Missions_Stat_Monthly_AverageInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_missions_stat_monthly_average(inputs)
	return en_missions_stat_monthly_average(inputs)
});