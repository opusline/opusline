/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Catalog_Price_RequiredInputs */

const en_catalog_price_required = /** @type {(inputs: Catalog_Price_RequiredInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Enter a price above zero`)
};

const fr_catalog_price_required = /** @type {(inputs: Catalog_Price_RequiredInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Indiquez un prix supérieur à zéro`)
};

/**
* | output |
* | --- |
* | "Enter a price above zero" |
*
* @param {Catalog_Price_RequiredInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const catalog_price_required = /** @type {((inputs?: Catalog_Price_RequiredInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Catalog_Price_RequiredInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_catalog_price_required(inputs)
	return en_catalog_price_required(inputs)
});