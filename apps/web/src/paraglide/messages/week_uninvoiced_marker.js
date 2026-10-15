/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Week_Uninvoiced_MarkerInputs */

const en_week_uninvoiced_marker = /** @type {(inputs: Week_Uninvoiced_MarkerInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Not invoiced`)
};

const fr_week_uninvoiced_marker = /** @type {(inputs: Week_Uninvoiced_MarkerInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Non facturé`)
};

/**
* | output |
* | --- |
* | "Not invoiced" |
*
* @param {Week_Uninvoiced_MarkerInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const week_uninvoiced_marker = /** @type {((inputs?: Week_Uninvoiced_MarkerInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Week_Uninvoiced_MarkerInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_week_uninvoiced_marker(inputs)
	return en_week_uninvoiced_marker(inputs)
});