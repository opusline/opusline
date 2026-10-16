/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Catalog_VatInputs */

const en_catalog_vat = /** @type {(inputs: Catalog_VatInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`VAT`)
};

const fr_catalog_vat = /** @type {(inputs: Catalog_VatInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`TVA`)
};

/**
* | output |
* | --- |
* | "VAT" |
*
* @param {Catalog_VatInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const catalog_vat = /** @type {((inputs?: Catalog_VatInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Catalog_VatInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_catalog_vat(inputs)
	return en_catalog_vat(inputs)
});