/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Mission_Status_PausedInputs */

const en_mission_status_paused = /** @type {(inputs: Mission_Status_PausedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Paused`)
};

const fr_mission_status_paused = /** @type {(inputs: Mission_Status_PausedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`En pause`)
};

/**
* | output |
* | --- |
* | "Paused" |
*
* @param {Mission_Status_PausedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const mission_status_paused = /** @type {((inputs?: Mission_Status_PausedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Mission_Status_PausedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_mission_status_paused(inputs)
	return en_mission_status_paused(inputs)
});