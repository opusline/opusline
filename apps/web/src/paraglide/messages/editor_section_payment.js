/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Editor_Section_PaymentInputs */

const en_editor_section_payment = /** @type {(inputs: Editor_Section_PaymentInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Payment`)
};

const fr_editor_section_payment = /** @type {(inputs: Editor_Section_PaymentInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Paiement`)
};

/**
* | output |
* | --- |
* | "Payment" |
*
* @param {Editor_Section_PaymentInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const editor_section_payment = /** @type {((inputs?: Editor_Section_PaymentInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Editor_Section_PaymentInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_editor_section_payment(inputs)
	return en_editor_section_payment(inputs)
});