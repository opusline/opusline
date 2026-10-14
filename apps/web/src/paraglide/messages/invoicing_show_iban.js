/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoicing_Show_IbanInputs */

const en_invoicing_show_iban = /** @type {(inputs: Invoicing_Show_IbanInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Show the IBAN and BIC on invoices`)
};

const fr_invoicing_show_iban = /** @type {(inputs: Invoicing_Show_IbanInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Afficher l'IBAN et le BIC sur les factures`)
};

/**
* | output |
* | --- |
* | "Show the IBAN and BIC on invoices" |
*
* @param {Invoicing_Show_IbanInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoicing_show_iban = /** @type {((inputs?: Invoicing_Show_IbanInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoicing_Show_IbanInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoicing_show_iban(inputs)
	return en_invoicing_show_iban(inputs)
});