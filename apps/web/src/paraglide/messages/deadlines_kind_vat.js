/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Deadlines_Kind_VatInputs */

const en_deadlines_kind_vat = /** @type {(inputs: Deadlines_Kind_VatInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`VAT · CA3`)
};

const fr_deadlines_kind_vat = /** @type {(inputs: Deadlines_Kind_VatInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`TVA · CA3`)
};

/**
* | output |
* | --- |
* | "VAT · CA3" |
*
* @param {Deadlines_Kind_VatInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const deadlines_kind_vat = /** @type {((inputs?: Deadlines_Kind_VatInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Deadlines_Kind_VatInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_deadlines_kind_vat(inputs)
	return en_deadlines_kind_vat(inputs)
});