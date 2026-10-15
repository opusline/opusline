/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Missions_Rate_Placeholder_FixedInputs */

const en_missions_rate_placeholder_fixed = /** @type {(inputs: Missions_Rate_Placeholder_FixedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`4,800`)
};

const fr_missions_rate_placeholder_fixed = /** @type {(inputs: Missions_Rate_Placeholder_FixedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`4 800`)
};

/**
* | output |
* | --- |
* | "4,800" |
*
* @param {Missions_Rate_Placeholder_FixedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const missions_rate_placeholder_fixed = /** @type {((inputs?: Missions_Rate_Placeholder_FixedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Missions_Rate_Placeholder_FixedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_missions_rate_placeholder_fixed(inputs)
	return en_missions_rate_placeholder_fixed(inputs)
});