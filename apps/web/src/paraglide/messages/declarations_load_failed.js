/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Declarations_Load_FailedInputs */



/**
* | output |
* | --- |
* | "The declarations could not be loaded. Try again in a moment." |
*
* @param {Declarations_Load_FailedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const declarations_load_failed = /** @type {((inputs?: Declarations_Load_FailedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Declarations_Load_FailedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("Les déclarations n'ont pas pu être chargées. Réessayez dans un instant.")
	return /** @type {LocalizedString} */ ("The declarations could not be loaded. Try again in a moment.")
});