/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Mission_Status_PersonalInputs */

const en_mission_status_personal = /** @type {(inputs: Mission_Status_PersonalInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Personal`)
};

const fr_mission_status_personal = /** @type {(inputs: Mission_Status_PersonalInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Perso`)
};

/**
* | output |
* | --- |
* | "Personal" |
*
* @param {Mission_Status_PersonalInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const mission_status_personal = /** @type {((inputs?: Mission_Status_PersonalInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Mission_Status_PersonalInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_mission_status_personal(inputs)
	return en_mission_status_personal(inputs)
});