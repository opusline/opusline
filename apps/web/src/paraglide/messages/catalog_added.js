/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Catalog_AddedInputs */

const en_catalog_added = /** @type {(inputs: Catalog_AddedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Service added to the catalogue`)
};

const fr_catalog_added = /** @type {(inputs: Catalog_AddedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Prestation ajoutée au catalogue`)
};

/**
* | output |
* | --- |
* | "Service added to the catalogue" |
*
* @param {Catalog_AddedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const catalog_added = /** @type {((inputs?: Catalog_AddedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Catalog_AddedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_catalog_added(inputs)
	return en_catalog_added(inputs)
});