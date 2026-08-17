/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Forfait_RemainingInputs */

const en_forfait_remaining = /** @type {(inputs: Forfait_RemainingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Left to bill`)
};

const fr_forfait_remaining = /** @type {(inputs: Forfait_RemainingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Reste à facturer`)
};

/**
* | output |
* | --- |
* | "Left to bill" |
*
* @param {Forfait_RemainingInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const forfait_remaining = /** @type {((inputs?: Forfait_RemainingInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Forfait_RemainingInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_forfait_remaining(inputs)
	return en_forfait_remaining(inputs)
});