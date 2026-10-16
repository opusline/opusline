/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Catalog_RemoveInputs */

const en_catalog_remove = /** @type {(inputs: Catalog_RemoveInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Remove`)
};

const fr_catalog_remove = /** @type {(inputs: Catalog_RemoveInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Retirer`)
};

/**
* | output |
* | --- |
* | "Remove" |
*
* @param {Catalog_RemoveInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const catalog_remove = /** @type {((inputs?: Catalog_RemoveInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Catalog_RemoveInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_catalog_remove(inputs)
	return en_catalog_remove(inputs)
});