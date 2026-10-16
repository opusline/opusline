/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoicing_New_Quote_DetailInputs */

const en_invoicing_new_quote_detail = /** @type {(inputs: Invoicing_New_Quote_DetailInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Validity, deposit and live preview`)
};

const fr_invoicing_new_quote_detail = /** @type {(inputs: Invoicing_New_Quote_DetailInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Validité, acompte et aperçu en direct`)
};

/**
* | output |
* | --- |
* | "Validity, deposit and live preview" |
*
* @param {Invoicing_New_Quote_DetailInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoicing_new_quote_detail = /** @type {((inputs?: Invoicing_New_Quote_DetailInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoicing_New_Quote_DetailInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoicing_new_quote_detail(inputs)
	return en_invoicing_new_quote_detail(inputs)
});