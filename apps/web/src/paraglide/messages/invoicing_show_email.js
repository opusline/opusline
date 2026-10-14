/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoicing_Show_EmailInputs */

const en_invoicing_show_email = /** @type {(inputs: Invoicing_Show_EmailInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Show my e-mail address`)
};

const fr_invoicing_show_email = /** @type {(inputs: Invoicing_Show_EmailInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Afficher mon adresse e-mail`)
};

/**
* | output |
* | --- |
* | "Show my e-mail address" |
*
* @param {Invoicing_Show_EmailInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoicing_show_email = /** @type {((inputs?: Invoicing_Show_EmailInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoicing_Show_EmailInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoicing_show_email(inputs)
	return en_invoicing_show_email(inputs)
});