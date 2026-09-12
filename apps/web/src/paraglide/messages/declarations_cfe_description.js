/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Declarations_Cfe_DescriptionInputs */

const en_declarations_cfe_description = /** @type {(inputs: Declarations_Cfe_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Cotisation foncière des entreprises · notice online mid-November`)
};

const fr_declarations_cfe_description = /** @type {(inputs: Declarations_Cfe_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Cotisation foncière des entreprises · avis en ligne mi-novembre`)
};

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
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_declarations_cfe_description(inputs)
	return en_declarations_cfe_description(inputs)
});