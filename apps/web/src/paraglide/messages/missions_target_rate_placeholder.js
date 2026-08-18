/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Missions_Target_Rate_PlaceholderInputs */

const en_missions_target_rate_placeholder = /** @type {(inputs: Missions_Target_Rate_PlaceholderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`550`)
};

const fr_missions_target_rate_placeholder = /** @type {(inputs: Missions_Target_Rate_PlaceholderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`550`)
};

/**
* | output |
* | --- |
* | "550" |
*
* @param {Missions_Target_Rate_PlaceholderInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const missions_target_rate_placeholder = /** @type {((inputs?: Missions_Target_Rate_PlaceholderInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Missions_Target_Rate_PlaceholderInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_missions_target_rate_placeholder(inputs)
	return en_missions_target_rate_placeholder(inputs)
});