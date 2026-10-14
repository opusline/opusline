/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Editor_ClientInputs */

const en_editor_client = /** @type {(inputs: Editor_ClientInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Client`)
};

const fr_editor_client = /** @type {(inputs: Editor_ClientInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Client`)
};

/**
* | output |
* | --- |
* | "Client" |
*
* @param {Editor_ClientInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const editor_client = /** @type {((inputs?: Editor_ClientInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Editor_ClientInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_editor_client(inputs)
	return en_editor_client(inputs)
});