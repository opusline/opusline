/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Catalog_Unit_PriceInputs */

const en_catalog_unit_price = /** @type {(inputs: Catalog_Unit_PriceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Unit price before tax`)
};

const fr_catalog_unit_price = /** @type {(inputs: Catalog_Unit_PriceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Prix unitaire HT`)
};

/**
* | output |
* | --- |
* | "Unit price before tax" |
*
* @param {Catalog_Unit_PriceInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const catalog_unit_price = /** @type {((inputs?: Catalog_Unit_PriceInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Catalog_Unit_PriceInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_catalog_unit_price(inputs)
	return en_catalog_unit_price(inputs)
});