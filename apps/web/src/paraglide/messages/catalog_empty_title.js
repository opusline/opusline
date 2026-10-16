/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Catalog_Empty_TitleInputs */

const en_catalog_empty_title = /** @type {(inputs: Catalog_Empty_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Empty catalogue`)
};

const fr_catalog_empty_title = /** @type {(inputs: Catalog_Empty_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Catalogue vide`)
};

/**
* | output |
* | --- |
* | "Empty catalogue" |
*
* @param {Catalog_Empty_TitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const catalog_empty_title = /** @type {((inputs?: Catalog_Empty_TitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Catalog_Empty_TitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_catalog_empty_title(inputs)
	return en_catalog_empty_title(inputs)
});