/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Deadline_Category_VatInputs */

const en_deadline_category_vat = /** @type {(inputs: Deadline_Category_VatInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`TVA`)
};

const fr_deadline_category_vat = /** @type {(inputs: Deadline_Category_VatInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`TVA`)
};

/**
* | output |
* | --- |
* | "TVA" |
*
* @param {Deadline_Category_VatInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const deadline_category_vat = /** @type {((inputs?: Deadline_Category_VatInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Deadline_Category_VatInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_deadline_category_vat(inputs)
	return en_deadline_category_vat(inputs)
});