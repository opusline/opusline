/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Catalog_TitleInputs */

const en_catalog_title = /** @type {(inputs: Catalog_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Catalogue`)
};

const fr_catalog_title = /** @type {(inputs: Catalog_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Catalogue`)
};

/**
* | output |
* | --- |
* | "Catalogue" |
*
* @param {Catalog_TitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const catalog_title = /** @type {((inputs?: Catalog_TitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Catalog_TitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_catalog_title(inputs)
	return en_catalog_title(inputs)
});