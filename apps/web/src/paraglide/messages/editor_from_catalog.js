/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Editor_From_CatalogInputs */

const en_editor_from_catalog = /** @type {(inputs: Editor_From_CatalogInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`From the catalogue`)
};

const fr_editor_from_catalog = /** @type {(inputs: Editor_From_CatalogInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Depuis le catalogue`)
};

/**
* | output |
* | --- |
* | "From the catalogue" |
*
* @param {Editor_From_CatalogInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const editor_from_catalog = /** @type {((inputs?: Editor_From_CatalogInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Editor_From_CatalogInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_editor_from_catalog(inputs)
	return en_editor_from_catalog(inputs)
});