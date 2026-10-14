/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Editor_Load_FailedInputs */

const en_editor_load_failed = /** @type {(inputs: Editor_Load_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The invoice could not be loaded.`)
};

const fr_editor_load_failed = /** @type {(inputs: Editor_Load_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`La facture n'a pas pu être chargée.`)
};

/**
* | output |
* | --- |
* | "The invoice could not be loaded." |
*
* @param {Editor_Load_FailedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const editor_load_failed = /** @type {((inputs?: Editor_Load_FailedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Editor_Load_FailedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_editor_load_failed(inputs)
	return en_editor_load_failed(inputs)
});