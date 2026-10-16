/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Editor_ValidateInputs */

const en_editor_validate = /** @type {(inputs: Editor_ValidateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Validate the invoice`)
};

const fr_editor_validate = /** @type {(inputs: Editor_ValidateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Valider la facture`)
};

/**
* | output |
* | --- |
* | "Validate the invoice" |
*
* @param {Editor_ValidateInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const editor_validate = /** @type {((inputs?: Editor_ValidateInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Editor_ValidateInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_editor_validate(inputs)
	return en_editor_validate(inputs)
});