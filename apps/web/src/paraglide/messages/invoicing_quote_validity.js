/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoicing_Quote_ValidityInputs */

const en_invoicing_quote_validity = /** @type {(inputs: Invoicing_Quote_ValidityInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Quote validity`)
};

const fr_invoicing_quote_validity = /** @type {(inputs: Invoicing_Quote_ValidityInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Validité des devis`)
};

/**
* | output |
* | --- |
* | "Quote validity" |
*
* @param {Invoicing_Quote_ValidityInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoicing_quote_validity = /** @type {((inputs?: Invoicing_Quote_ValidityInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoicing_Quote_ValidityInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoicing_quote_validity(inputs)
	return en_invoicing_quote_validity(inputs)
});