/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Declarations_Box_25_RefundableInputs */



/**
* | output |
* | --- |
* | "refundable · box 26 (≥ 760 €) or carried to box 22" |
*
* @param {Declarations_Box_25_RefundableInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const declarations_box_25_refundable = /** @type {((inputs?: Declarations_Box_25_RefundableInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Declarations_Box_25_RefundableInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("remboursable · case 26 (≥ 760 €) ou report en case 22")
	return /** @type {LocalizedString} */ ("refundable · box 26 (≥ 760 €) or carried to box 22")
});