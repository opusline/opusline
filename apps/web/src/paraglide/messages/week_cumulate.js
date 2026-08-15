/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Week_CumulateInputs */

const en_week_cumulate = /** @type {(inputs: Week_CumulateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Add on top`)
};

const fr_week_cumulate = /** @type {(inputs: Week_CumulateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Cumuler`)
};

/**
* | output |
* | --- |
* | "Add on top" |
*
* @param {Week_CumulateInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const week_cumulate = /** @type {((inputs?: Week_CumulateInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Week_CumulateInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_week_cumulate(inputs)
	return en_week_cumulate(inputs)
});