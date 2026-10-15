/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Mission_Status_ActiveInputs */

const en_mission_status_active = /** @type {(inputs: Mission_Status_ActiveInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Active`)
};

const fr_mission_status_active = /** @type {(inputs: Mission_Status_ActiveInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Active`)
};

/**
* | output |
* | --- |
* | "Active" |
*
* @param {Mission_Status_ActiveInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const mission_status_active = /** @type {((inputs?: Mission_Status_ActiveInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Mission_Status_ActiveInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_mission_status_active(inputs)
	return en_mission_status_active(inputs)
});