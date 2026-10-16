/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Editor_Validate_QuoteInputs */

const en_editor_validate_quote = /** @type {(inputs: Editor_Validate_QuoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Validate the quote`)
};

const fr_editor_validate_quote = /** @type {(inputs: Editor_Validate_QuoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Valider le devis`)
};

/**
* | output |
* | --- |
* | "Validate the quote" |
*
* @param {Editor_Validate_QuoteInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const editor_validate_quote = /** @type {((inputs?: Editor_Validate_QuoteInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Editor_Validate_QuoteInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_editor_validate_quote(inputs)
	return en_editor_validate_quote(inputs)
});