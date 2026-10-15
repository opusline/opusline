/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Deadline_Kind_Vat_Ca3Inputs */

const en_deadline_kind_vat_ca3 = /** @type {(inputs: Deadline_Kind_Vat_Ca3Inputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`TVA — CA3`)
};

const fr_deadline_kind_vat_ca3 = /** @type {(inputs: Deadline_Kind_Vat_Ca3Inputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`TVA — CA3`)
};

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
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_deadline_kind_vat_ca3(inputs)
	return en_deadline_kind_vat_ca3(inputs)
});