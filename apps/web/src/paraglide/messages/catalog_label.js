/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Catalog_LabelInputs */

const en_catalog_label = /** @type {(inputs: Catalog_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Name`)
};

const fr_catalog_label = /** @type {(inputs: Catalog_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Désignation`)
};

/**
* | output |
* | --- |
* | "Name" |
*
* @param {Catalog_LabelInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const catalog_label = /** @type {((inputs?: Catalog_LabelInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Catalog_LabelInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_catalog_label(inputs)
	return en_catalog_label(inputs)
});