/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Week_Billable_TitleInputs */

const en_week_billable_title = /** @type {(inputs: Week_Billable_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Billable this week`)
};

const fr_week_billable_title = /** @type {(inputs: Week_Billable_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Facturable cette semaine`)
};

/**
* | output |
* | --- |
* | "Billable this week" |
*
* @param {Week_Billable_TitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const week_billable_title = /** @type {((inputs?: Week_Billable_TitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Week_Billable_TitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_week_billable_title(inputs)
	return en_week_billable_title(inputs)
});