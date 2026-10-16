/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Catalog_SavedInputs */

const en_catalog_saved = /** @type {(inputs: Catalog_SavedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Service saved`)
};

const fr_catalog_saved = /** @type {(inputs: Catalog_SavedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Prestation enregistrée`)
};

/**
* | output |
* | --- |
* | "Service saved" |
*
* @param {Catalog_SavedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const catalog_saved = /** @type {((inputs?: Catalog_SavedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Catalog_SavedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_catalog_saved(inputs)
	return en_catalog_saved(inputs)
});