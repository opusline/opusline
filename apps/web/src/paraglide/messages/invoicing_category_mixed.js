/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoicing_Category_MixedInputs */

const en_invoicing_category_mixed = /** @type {(inputs: Invoicing_Category_MixedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Goods and services`)
};

const fr_invoicing_category_mixed = /** @type {(inputs: Invoicing_Category_MixedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Biens et services`)
};

/**
* | output |
* | --- |
* | "Goods and services" |
*
* @param {Invoicing_Category_MixedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoicing_category_mixed = /** @type {((inputs?: Invoicing_Category_MixedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoicing_Category_MixedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoicing_category_mixed(inputs)
	return en_invoicing_category_mixed(inputs)
});