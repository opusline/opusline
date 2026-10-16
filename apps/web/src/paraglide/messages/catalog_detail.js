/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Catalog_DetailInputs */

const en_catalog_detail = /** @type {(inputs: Catalog_DetailInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Detail · printed under the line`)
};

const fr_catalog_detail = /** @type {(inputs: Catalog_DetailInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Détail · repris sous la ligne`)
};

/**
* | output |
* | --- |
* | "Detail · printed under the line" |
*
* @param {Catalog_DetailInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const catalog_detail = /** @type {((inputs?: Catalog_DetailInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Catalog_DetailInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_catalog_detail(inputs)
	return en_catalog_detail(inputs)
});