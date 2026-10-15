/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Deadline_Kind_Vat_Ca12Inputs */

const en_deadline_kind_vat_ca12 = /** @type {(inputs: Deadline_Kind_Vat_Ca12Inputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`TVA — CA12`)
};

const fr_deadline_kind_vat_ca12 = /** @type {(inputs: Deadline_Kind_Vat_Ca12Inputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`TVA — CA12`)
};

/**
* | output |
* | --- |
* | "TVA — CA12" |
*
* @param {Deadline_Kind_Vat_Ca12Inputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const deadline_kind_vat_ca12 = /** @type {((inputs?: Deadline_Kind_Vat_Ca12Inputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Deadline_Kind_Vat_Ca12Inputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_deadline_kind_vat_ca12(inputs)
	return en_deadline_kind_vat_ca12(inputs)
});