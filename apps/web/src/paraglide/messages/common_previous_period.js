/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Common_Previous_PeriodInputs */

const en_common_previous_period = /** @type {(inputs: Common_Previous_PeriodInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Previous period`)
};

const fr_common_previous_period = /** @type {(inputs: Common_Previous_PeriodInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Période précédente`)
};

/**
* | output |
* | --- |
* | "Previous period" |
*
* @param {Common_Previous_PeriodInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const common_previous_period = /** @type {((inputs?: Common_Previous_PeriodInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Common_Previous_PeriodInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_common_previous_period(inputs)
	return en_common_previous_period(inputs)
});