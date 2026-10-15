/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Deadline_Kind_Vat_Ca3Inputs */



/**
* | output |
* | --- |
* | "TVA — CA3" |
*
* @param {Deadline_Kind_Vat_Ca3Inputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const deadline_kind_vat_ca3 = /** @type {((inputs?: Deadline_Kind_Vat_Ca3Inputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Deadline_Kind_Vat_Ca3Inputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("TVA — CA3")
	return /** @type {LocalizedString} */ ("TVA — CA3")
});