/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Catalog_FranchiseInputs */

const en_catalog_franchise = /** @type {(inputs: Catalog_FranchiseInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`franchise`)
};

const fr_catalog_franchise = /** @type {(inputs: Catalog_FranchiseInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`franchise`)
};

/**
* | output |
* | --- |
* | "franchise" |
*
* @param {Catalog_FranchiseInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const catalog_franchise = /** @type {((inputs?: Catalog_FranchiseInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Catalog_FranchiseInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_catalog_franchise(inputs)
	return en_catalog_franchise(inputs)
});