/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoicing_Terms_TitleInputs */

const en_invoicing_terms_title = /** @type {(inputs: Invoicing_Terms_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Payment terms`)
};

const fr_invoicing_terms_title = /** @type {(inputs: Invoicing_Terms_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Conditions de paiement`)
};

/**
* | output |
* | --- |
* | "Payment terms" |
*
* @param {Invoicing_Terms_TitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoicing_terms_title = /** @type {((inputs?: Invoicing_Terms_TitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoicing_Terms_TitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoicing_terms_title(inputs)
	return en_invoicing_terms_title(inputs)
});