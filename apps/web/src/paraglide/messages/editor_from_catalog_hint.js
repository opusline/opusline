/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Editor_From_Catalog_HintInputs */

const en_editor_from_catalog_hint = /** @type {(inputs: Editor_From_Catalog_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Your usual services, at the stored price`)
};

const fr_editor_from_catalog_hint = /** @type {(inputs: Editor_From_Catalog_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Vos prestations habituelles, au prix enregistré`)
};

/**
* | output |
* | --- |
* | "Your usual services, at the stored price" |
*
* @param {Editor_From_Catalog_HintInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const editor_from_catalog_hint = /** @type {((inputs?: Editor_From_Catalog_HintInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Editor_From_Catalog_HintInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_editor_from_catalog_hint(inputs)
	return en_editor_from_catalog_hint(inputs)
});