/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Catalog_AddInputs */

const en_catalog_add = /** @type {(inputs: Catalog_AddInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Add a service`)
};

const fr_catalog_add = /** @type {(inputs: Catalog_AddInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ajouter une prestation`)
};

/**
* | output |
* | --- |
* | "Add a service" |
*
* @param {Catalog_AddInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const catalog_add = /** @type {((inputs?: Catalog_AddInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Catalog_AddInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_catalog_add(inputs)
	return en_catalog_add(inputs)
});