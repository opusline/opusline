/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Cra_Holiday_ShortInputs */

const en_cra_holiday_short = /** @type {(inputs: Cra_Holiday_ShortInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Holiday`)
};

const fr_cra_holiday_short = /** @type {(inputs: Cra_Holiday_ShortInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Férié`)
};

/**
* | output |
* | --- |
* | "Holiday" |
*
* @param {Cra_Holiday_ShortInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const cra_holiday_short = /** @type {((inputs?: Cra_Holiday_ShortInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Cra_Holiday_ShortInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_cra_holiday_short(inputs)
	return en_cra_holiday_short(inputs)
});