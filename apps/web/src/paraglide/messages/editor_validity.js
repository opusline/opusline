/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Editor_ValidityInputs */

const en_editor_validity = /** @type {(inputs: Editor_ValidityInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Quote validity`)
};

const fr_editor_validity = /** @type {(inputs: Editor_ValidityInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Validité du devis`)
};

/**
* | output |
* | --- |
* | "Quote validity" |
*
* @param {Editor_ValidityInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const editor_validity = /** @type {((inputs?: Editor_ValidityInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Editor_ValidityInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_editor_validity(inputs)
	return en_editor_validity(inputs)
});