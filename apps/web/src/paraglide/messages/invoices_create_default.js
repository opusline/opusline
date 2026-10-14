/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoices_Create_DefaultInputs */

const en_invoices_create_default = /** @type {(inputs: Invoices_Create_DefaultInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`default`)
};

const fr_invoices_create_default = /** @type {(inputs: Invoices_Create_DefaultInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`par défaut`)
};

/**
* | output |
* | --- |
* | "default" |
*
* @param {Invoices_Create_DefaultInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoices_create_default = /** @type {((inputs?: Invoices_Create_DefaultInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoices_Create_DefaultInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoices_create_default(inputs)
	return en_invoices_create_default(inputs)
});