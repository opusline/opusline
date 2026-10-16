/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoicing_New_External_Quote_DetailInputs */

const en_invoicing_new_external_quote_detail = /** @type {(inputs: Invoicing_New_External_Quote_DetailInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Reference, amount and PDF from another tool`)
};

const fr_invoicing_new_external_quote_detail = /** @type {(inputs: Invoicing_New_External_Quote_DetailInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Référence, montant et PDF d'un autre outil`)
};

/**
* | output |
* | --- |
* | "Reference, amount and PDF from another tool" |
*
* @param {Invoicing_New_External_Quote_DetailInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoicing_new_external_quote_detail = /** @type {((inputs?: Invoicing_New_External_Quote_DetailInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoicing_New_External_Quote_DetailInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoicing_new_external_quote_detail(inputs)
	return en_invoicing_new_external_quote_detail(inputs)
});