/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Common_Next_PeriodInputs */

const en_common_next_period = /** @type {(inputs: Common_Next_PeriodInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Next period`)
};

const fr_common_next_period = /** @type {(inputs: Common_Next_PeriodInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Période suivante`)
};

/**
* | output |
* | --- |
* | "Next period" |
*
* @param {Common_Next_PeriodInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const common_next_period = /** @type {((inputs?: Common_Next_PeriodInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Common_Next_PeriodInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_common_next_period(inputs)
	return en_common_next_period(inputs)
});