/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Missions_Reference_Rate_PlaceholderInputs */

const en_missions_reference_rate_placeholder = /** @type {(inputs: Missions_Reference_Rate_PlaceholderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`480`)
};

const fr_missions_reference_rate_placeholder = /** @type {(inputs: Missions_Reference_Rate_PlaceholderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`480`)
};

/**
* | output |
* | --- |
* | "480" |
*
* @param {Missions_Reference_Rate_PlaceholderInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const missions_reference_rate_placeholder = /** @type {((inputs?: Missions_Reference_Rate_PlaceholderInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Missions_Reference_Rate_PlaceholderInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_missions_reference_rate_placeholder(inputs)
	return en_missions_reference_rate_placeholder(inputs)
});