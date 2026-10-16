/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Editor_Catalog_EmptyInputs */

const en_editor_catalog_empty = /** @type {(inputs: Editor_Catalog_EmptyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The catalogue is empty.`)
};

const fr_editor_catalog_empty = /** @type {(inputs: Editor_Catalog_EmptyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Le catalogue est vide.`)
};

/**
* | output |
* | --- |
* | "The catalogue is empty." |
*
* @param {Editor_Catalog_EmptyInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const editor_catalog_empty = /** @type {((inputs?: Editor_Catalog_EmptyInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Editor_Catalog_EmptyInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_editor_catalog_empty(inputs)
	return en_editor_catalog_empty(inputs)
});