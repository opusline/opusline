/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Declarations_History_VatInputs */

const en_declarations_history_vat = /** @type {(inputs: Declarations_History_VatInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`CA3 · TVA`)
};

const fr_declarations_history_vat = /** @type {(inputs: Declarations_History_VatInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`CA3 · TVA`)
};

/**
* | output |
* | --- |
* | "CA3 · TVA" |
*
* @param {Declarations_History_VatInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const declarations_history_vat = /** @type {((inputs?: Declarations_History_VatInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Declarations_History_VatInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_declarations_history_vat(inputs)
	return en_declarations_history_vat(inputs)
});