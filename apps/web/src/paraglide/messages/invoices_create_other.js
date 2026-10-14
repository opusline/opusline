/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoices_Create_OtherInputs */

const en_invoices_create_other = /** @type {(inputs: Invoices_Create_OtherInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Other ways to add`)
};

const fr_invoices_create_other = /** @type {(inputs: Invoices_Create_OtherInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Autres façons d'ajouter`)
};

/**
* | output |
* | --- |
* | "Other ways to add" |
*
* @param {Invoices_Create_OtherInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoices_create_other = /** @type {((inputs?: Invoices_Create_OtherInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoices_Create_OtherInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoices_create_other(inputs)
	return en_invoices_create_other(inputs)
});