/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Catalog_Empty_DescriptionInputs */

const en_catalog_empty_description = /** @type {(inputs: Catalog_Empty_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Add your usual services to pick them in one click.`)
};

const fr_catalog_empty_description = /** @type {(inputs: Catalog_Empty_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ajoutez vos prestations courantes pour les reprendre en un clic.`)
};

/**
* | output |
* | --- |
* | "Add your usual services to pick them in one click." |
*
* @param {Catalog_Empty_DescriptionInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const catalog_empty_description = /** @type {((inputs?: Catalog_Empty_DescriptionInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Catalog_Empty_DescriptionInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_catalog_empty_description(inputs)
	return en_catalog_empty_description(inputs)
});