/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Common_DurationInputs */

const en_common_duration = /** @type {(inputs: Common_DurationInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Duration`)
};

const fr_common_duration = /** @type {(inputs: Common_DurationInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Durée`)
};

/**
* | output |
* | --- |
* | "Duration" |
*
* @param {Common_DurationInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const common_duration = /** @type {((inputs?: Common_DurationInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Common_DurationInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_common_duration(inputs)
	return en_common_duration(inputs)
});