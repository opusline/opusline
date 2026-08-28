/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Deadline_Category_UrssafInputs */

const en_deadline_category_urssaf = /** @type {(inputs: Deadline_Category_UrssafInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`URSSAF`)
};

const fr_deadline_category_urssaf = /** @type {(inputs: Deadline_Category_UrssafInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`URSSAF`)
};

/**
* | output |
* | --- |
* | "URSSAF" |
*
* @param {Deadline_Category_UrssafInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const deadline_category_urssaf = /** @type {((inputs?: Deadline_Category_UrssafInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Deadline_Category_UrssafInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_deadline_category_urssaf(inputs)
	return en_deadline_category_urssaf(inputs)
});