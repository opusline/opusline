/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ amount: NonNullable<unknown> }} Editor_TotalInputs */

const en_editor_total = /** @type {(inputs: Editor_TotalInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Total incl. VAT ${i?.amount}`)
};

const fr_editor_total = /** @type {(inputs: Editor_TotalInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Total TTC ${i?.amount}`)
};

/**
* | output |
* | --- |
* | "Total incl. VAT {amount}" |
*
* @param {Editor_TotalInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const editor_total = /** @type {((inputs: Editor_TotalInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Editor_TotalInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_editor_total(inputs)
	return en_editor_total(inputs)
});