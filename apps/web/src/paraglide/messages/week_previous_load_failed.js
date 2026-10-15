/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Week_Previous_Load_FailedInputs */



/**
* | output |
* | --- |
* | "Last week could not be loaded. Try again in a moment." |
*
* @param {Week_Previous_Load_FailedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const week_previous_load_failed = /** @type {((inputs?: Week_Previous_Load_FailedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Week_Previous_Load_FailedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("La semaine précédente n'a pas pu être chargée. Réessayez dans un instant.")
	return /** @type {LocalizedString} */ ("Last week could not be loaded. Try again in a moment.")
});