/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoicing_Category_GoodsInputs */

const en_invoicing_category_goods = /** @type {(inputs: Invoicing_Category_GoodsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Delivery of goods`)
};

const fr_invoicing_category_goods = /** @type {(inputs: Invoicing_Category_GoodsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Livraison de biens`)
};

/**
* | output |
* | --- |
* | "Delivery of goods" |
*
* @param {Invoicing_Category_GoodsInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoicing_category_goods = /** @type {((inputs?: Invoicing_Category_GoodsInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoicing_Category_GoodsInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoicing_category_goods(inputs)
	return en_invoicing_category_goods(inputs)
});