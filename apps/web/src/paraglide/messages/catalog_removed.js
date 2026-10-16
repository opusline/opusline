/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ label: NonNullable<unknown> }} Catalog_RemovedInputs */

const en_catalog_removed = /** @type {(inputs: Catalog_RemovedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`« ${i?.label} » removed from the catalogue`)
};

const fr_catalog_removed = /** @type {(inputs: Catalog_RemovedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`« ${i?.label} » retirée du catalogue`)
};

/**
* | output |
* | --- |
* | "« {label} » removed from the catalogue" |
*
* @param {Catalog_RemovedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const catalog_removed = /** @type {((inputs: Catalog_RemovedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Catalog_RemovedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_catalog_removed(inputs)
	return en_catalog_removed(inputs)
});