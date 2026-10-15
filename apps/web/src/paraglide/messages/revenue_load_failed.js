/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Revenue_Load_FailedInputs */

const en_revenue_load_failed = /** @type {(inputs: Revenue_Load_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The revenue could not be loaded. Try again in a moment.`)
};

const fr_revenue_load_failed = /** @type {(inputs: Revenue_Load_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Les revenus n'ont pas pu être chargés. Réessayez dans un instant.`)
};

/**
* | output |
* | --- |
* | "The revenue could not be loaded. Try again in a moment." |
*
* @param {Revenue_Load_FailedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const revenue_load_failed = /** @type {((inputs?: Revenue_Load_FailedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Revenue_Load_FailedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_revenue_load_failed(inputs)
	return en_revenue_load_failed(inputs)
});