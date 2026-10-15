/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Week_Billable_EmptyInputs */

const en_week_billable_empty = /** @type {(inputs: Week_Billable_EmptyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Nothing billable tracked this week yet`)
};

const fr_week_billable_empty = /** @type {(inputs: Week_Billable_EmptyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Rien de facturable saisi cette semaine`)
};

/**
* | output |
* | --- |
* | "Nothing billable tracked this week yet" |
*
* @param {Week_Billable_EmptyInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const week_billable_empty = /** @type {((inputs?: Week_Billable_EmptyInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Week_Billable_EmptyInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_week_billable_empty(inputs)
	return en_week_billable_empty(inputs)
});