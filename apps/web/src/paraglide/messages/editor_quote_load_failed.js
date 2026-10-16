/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Editor_Quote_Load_FailedInputs */

const en_editor_quote_load_failed = /** @type {(inputs: Editor_Quote_Load_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The quote could not be loaded.`)
};

const fr_editor_quote_load_failed = /** @type {(inputs: Editor_Quote_Load_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Le devis n'a pas pu être chargé.`)
};

/**
* | output |
* | --- |
* | "The quote could not be loaded." |
*
* @param {Editor_Quote_Load_FailedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const editor_quote_load_failed = /** @type {((inputs?: Editor_Quote_Load_FailedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Editor_Quote_Load_FailedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_editor_quote_load_failed(inputs)
	return en_editor_quote_load_failed(inputs)
});