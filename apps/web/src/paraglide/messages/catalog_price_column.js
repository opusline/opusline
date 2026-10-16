/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Catalog_Price_ColumnInputs */

const en_catalog_price_column = /** @type {(inputs: Catalog_Price_ColumnInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Price before tax`)
};

const fr_catalog_price_column = /** @type {(inputs: Catalog_Price_ColumnInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Prix HT`)
};

/**
* | output |
* | --- |
* | "Price before tax" |
*
* @param {Catalog_Price_ColumnInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const catalog_price_column = /** @type {((inputs?: Catalog_Price_ColumnInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Catalog_Price_ColumnInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_catalog_price_column(inputs)
	return en_catalog_price_column(inputs)
});