/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoicing_Terms_DefaultInputs */

const en_invoicing_terms_default = /** @type {(inputs: Invoicing_Terms_DefaultInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Default payment term`)
};

const fr_invoicing_terms_default = /** @type {(inputs: Invoicing_Terms_DefaultInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Délai de paiement par défaut`)
};

/**
* | output |
* | --- |
* | "Default payment term" |
*
* @param {Invoicing_Terms_DefaultInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoicing_terms_default = /** @type {((inputs?: Invoicing_Terms_DefaultInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoicing_Terms_DefaultInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoicing_terms_default(inputs)
	return en_invoicing_terms_default(inputs)
});