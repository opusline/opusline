/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Occurrence_State_InactiveInputs */

const en_occurrence_state_inactive = /** @type {(inputs: Occurrence_State_InactiveInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`outside the subscription`)
};

const fr_occurrence_state_inactive = /** @type {(inputs: Occurrence_State_InactiveInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`hors abonnement`)
};

/**
* | output |
* | --- |
* | "outside the subscription" |
*
* @param {Occurrence_State_InactiveInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const occurrence_state_inactive = /** @type {((inputs?: Occurrence_State_InactiveInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Occurrence_State_InactiveInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_occurrence_state_inactive(inputs)
	return en_occurrence_state_inactive(inputs)
});