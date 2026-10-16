/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ number: NonNullable<unknown> }} Editor_IssuedInputs */

const en_editor_issued = /** @type {(inputs: Editor_IssuedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Invoice ${i?.number} validated`)
};

const fr_editor_issued = /** @type {(inputs: Editor_IssuedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Facture ${i?.number} validée`)
};

/**
* | output |
* | --- |
* | "Invoice {number} validated" |
*
* @param {Editor_IssuedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const editor_issued = /** @type {((inputs: Editor_IssuedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Editor_IssuedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_editor_issued(inputs)
	return en_editor_issued(inputs)
});