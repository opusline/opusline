/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Editor_TermInputs */

const en_editor_term = /** @type {(inputs: Editor_TermInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Payment term`)
};

const fr_editor_term = /** @type {(inputs: Editor_TermInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Délai de paiement`)
};

/**
* | output |
* | --- |
* | "Payment term" |
*
* @param {Editor_TermInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const editor_term = /** @type {((inputs?: Editor_TermInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Editor_TermInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_editor_term(inputs)
	return en_editor_term(inputs)
});