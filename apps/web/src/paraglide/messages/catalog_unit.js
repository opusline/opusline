/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Catalog_UnitInputs */

const en_catalog_unit = /** @type {(inputs: Catalog_UnitInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Unit`)
};

const fr_catalog_unit = /** @type {(inputs: Catalog_UnitInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Unité`)
};

/**
* | output |
* | --- |
* | "Unit" |
*
* @param {Catalog_UnitInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const catalog_unit = /** @type {((inputs?: Catalog_UnitInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Catalog_UnitInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_catalog_unit(inputs)
	return en_catalog_unit(inputs)
});