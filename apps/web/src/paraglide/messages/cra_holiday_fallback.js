/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Cra_Holiday_FallbackInputs */

const en_cra_holiday_fallback = /** @type {(inputs: Cra_Holiday_FallbackInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`public holiday`)
};

const fr_cra_holiday_fallback = /** @type {(inputs: Cra_Holiday_FallbackInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`jour férié`)
};

/**
* | output |
* | --- |
* | "public holiday" |
*
* @param {Cra_Holiday_FallbackInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const cra_holiday_fallback = /** @type {((inputs?: Cra_Holiday_FallbackInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Cra_Holiday_FallbackInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_cra_holiday_fallback(inputs)
	return en_cra_holiday_fallback(inputs)
});