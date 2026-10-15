/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Week_Uninvoiced_MarkerInputs */



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
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("Non facturé")
	return /** @type {LocalizedString} */ ("Not invoiced")
});