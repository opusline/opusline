/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Mission_Status_CompletedInputs */

const en_mission_status_completed = /** @type {(inputs: Mission_Status_CompletedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Completed`)
};

const fr_mission_status_completed = /** @type {(inputs: Mission_Status_CompletedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Terminée`)
};

/**
* | output |
* | --- |
* | "Completed" |
*
* @param {Mission_Status_CompletedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const mission_status_completed = /** @type {((inputs?: Mission_Status_CompletedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Mission_Status_CompletedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_mission_status_completed(inputs)
	return en_mission_status_completed(inputs)
});