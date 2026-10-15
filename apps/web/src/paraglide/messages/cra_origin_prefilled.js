/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Cra_Origin_PrefilledInputs */



/**
* | output |
* | --- |
* | "pre-filled from your entries" |
*
* @param {Cra_Origin_PrefilledInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const cra_origin_prefilled = /** @type {((inputs?: Cra_Origin_PrefilledInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Cra_Origin_PrefilledInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("pré-rempli depuis vos entrées")
	return /** @type {LocalizedString} */ ("pre-filled from your entries")
});