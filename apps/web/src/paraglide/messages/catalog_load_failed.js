/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Catalog_Load_FailedInputs */

const en_catalog_load_failed = /** @type {(inputs: Catalog_Load_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The catalogue could not be loaded.`)
};

const fr_catalog_load_failed = /** @type {(inputs: Catalog_Load_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Le catalogue n'a pas pu être chargé.`)
};

/**
* | output |
* | --- |
* | "The catalogue could not be loaded." |
*
* @param {Catalog_Load_FailedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const catalog_load_failed = /** @type {((inputs?: Catalog_Load_FailedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Catalog_Load_FailedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_catalog_load_failed(inputs)
	return en_catalog_load_failed(inputs)
});