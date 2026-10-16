/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoicing_Category_LabelInputs */

const en_invoicing_category_label = /** @type {(inputs: Invoicing_Category_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Category of the operation`)
};

const fr_invoicing_category_label = /** @type {(inputs: Invoicing_Category_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Catégorie de l'opération`)
};

/**
* | output |
* | --- |
* | "Category of the operation" |
*
* @param {Invoicing_Category_LabelInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoicing_category_label = /** @type {((inputs?: Invoicing_Category_LabelInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoicing_Category_LabelInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoicing_category_label(inputs)
	return en_invoicing_category_label(inputs)
});