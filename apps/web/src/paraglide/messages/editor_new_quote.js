/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Editor_New_QuoteInputs */

const en_editor_new_quote = /** @type {(inputs: Editor_New_QuoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`New quote`)
};

const fr_editor_new_quote = /** @type {(inputs: Editor_New_QuoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Nouveau devis`)
};

/**
* | output |
* | --- |
* | "New quote" |
*
* @param {Editor_New_QuoteInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const editor_new_quote = /** @type {((inputs?: Editor_New_QuoteInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Editor_New_QuoteInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_editor_new_quote(inputs)
	return en_editor_new_quote(inputs)
});