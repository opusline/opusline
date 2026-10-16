/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ number: NonNullable<unknown> }} Editor_Quote_IssuedInputs */

const en_editor_quote_issued = /** @type {(inputs: Editor_Quote_IssuedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Quote ${i?.number} validated`)
};

const fr_editor_quote_issued = /** @type {(inputs: Editor_Quote_IssuedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Devis ${i?.number} validé`)
};

/**
* | output |
* | --- |
* | "Quote {number} validated" |
*
* @param {Editor_Quote_IssuedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const editor_quote_issued = /** @type {((inputs: Editor_Quote_IssuedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Editor_Quote_IssuedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_editor_quote_issued(inputs)
	return en_editor_quote_issued(inputs)
});