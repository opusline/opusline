/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Week_Weekend_ShortInputs */

const en_week_weekend_short = /** @type {(inputs: Week_Weekend_ShortInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`S-S`)
};

const fr_week_weekend_short = /** @type {(inputs: Week_Weekend_ShortInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`S-D`)
};

/**
* | output |
* | --- |
* | "S-S" |
*
* @param {Week_Weekend_ShortInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const week_weekend_short = /** @type {((inputs?: Week_Weekend_ShortInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Week_Weekend_ShortInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_week_weekend_short(inputs)
	return en_week_weekend_short(inputs)
});