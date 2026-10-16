/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Quotes_Create_Elsewhere_DetailInputs */

const en_quotes_create_elsewhere_detail = /** @type {(inputs: Quotes_Create_Elsewhere_DetailInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Its reference and its amount; the document stays your tool's.`)
};

const fr_quotes_create_elsewhere_detail = /** @type {(inputs: Quotes_Create_Elsewhere_DetailInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Sa référence et son montant ; le document reste celui de votre outil.`)
};

/**
* | output |
* | --- |
* | "Its reference and its amount; the document stays your tool's." |
*
* @param {Quotes_Create_Elsewhere_DetailInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const quotes_create_elsewhere_detail = /** @type {((inputs?: Quotes_Create_Elsewhere_DetailInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Quotes_Create_Elsewhere_DetailInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_quotes_create_elsewhere_detail(inputs)
	return en_quotes_create_elsewhere_detail(inputs)
});