/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Common_MissionInputs */

const en_common_mission = /** @type {(inputs: Common_MissionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Mission`)
};

const fr_common_mission = /** @type {(inputs: Common_MissionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Mission`)
};

/**
* | output |
* | --- |
* | "Mission" |
*
* @param {Common_MissionInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const common_mission = /** @type {((inputs?: Common_MissionInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Common_MissionInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_common_mission(inputs)
	return en_common_mission(inputs)
});