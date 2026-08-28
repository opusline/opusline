/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Deadline_Category_OtherInputs */

const en_deadline_category_other = /** @type {(inputs: Deadline_Category_OtherInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Other`)
};

const fr_deadline_category_other = /** @type {(inputs: Deadline_Category_OtherInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Autres`)
};

/**
* | output |
* | --- |
* | "Other" |
*
* @param {Deadline_Category_OtherInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const deadline_category_other = /** @type {((inputs?: Deadline_Category_OtherInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Deadline_Category_OtherInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_deadline_category_other(inputs)
	return en_deadline_category_other(inputs)
});