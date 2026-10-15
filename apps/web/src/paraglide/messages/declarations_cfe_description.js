/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Declarations_Cfe_DescriptionInputs */



/**
* | output |
* | --- |
* | "Cotisation foncière des entreprises · notice online mid-November" |
*
* @param {Declarations_Cfe_DescriptionInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const declarations_cfe_description = /** @type {((inputs?: Declarations_Cfe_DescriptionInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Declarations_Cfe_DescriptionInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("Cotisation foncière des entreprises · avis en ligne mi-novembre")
	return /** @type {LocalizedString} */ ("Cotisation foncière des entreprises · notice online mid-November")
});