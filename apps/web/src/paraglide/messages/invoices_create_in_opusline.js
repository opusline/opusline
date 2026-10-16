/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoices_Create_In_OpuslineInputs */

const en_invoices_create_in_opusline = /** @type {(inputs: Invoices_Create_In_OpuslineInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Create in Opusline`)
};

const fr_invoices_create_in_opusline = /** @type {(inputs: Invoices_Create_In_OpuslineInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Créer dans Opusline`)
};

/**
* | output |
* | --- |
* | "Create in Opusline" |
*
* @param {Invoices_Create_In_OpuslineInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoices_create_in_opusline = /** @type {((inputs?: Invoices_Create_In_OpuslineInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoices_Create_In_OpuslineInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoices_create_in_opusline(inputs)
	return en_invoices_create_in_opusline(inputs)
});