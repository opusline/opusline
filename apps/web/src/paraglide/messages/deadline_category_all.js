/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Deadline_Category_AllInputs */

const en_deadline_category_all = /** @type {(inputs: Deadline_Category_AllInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`All`)
};

const fr_deadline_category_all = /** @type {(inputs: Deadline_Category_AllInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Tout`)
};

/**
* | output |
* | --- |
* | "All" |
*
* @param {Deadline_Category_AllInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const deadline_category_all = /** @type {((inputs?: Deadline_Category_AllInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Deadline_Category_AllInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_deadline_category_all(inputs)
	return en_deadline_category_all(inputs)
});