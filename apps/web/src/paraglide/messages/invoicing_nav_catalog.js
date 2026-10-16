/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoicing_Nav_CatalogInputs */

const en_invoicing_nav_catalog = /** @type {(inputs: Invoicing_Nav_CatalogInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Catalogue`)
};

const fr_invoicing_nav_catalog = /** @type {(inputs: Invoicing_Nav_CatalogInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Catalogue`)
};

/**
* | output |
* | --- |
* | "Catalogue" |
*
* @param {Invoicing_Nav_CatalogInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoicing_nav_catalog = /** @type {((inputs?: Invoicing_Nav_CatalogInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoicing_Nav_CatalogInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoicing_nav_catalog(inputs)
	return en_invoicing_nav_catalog(inputs)
});