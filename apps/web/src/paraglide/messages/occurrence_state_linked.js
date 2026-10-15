/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Occurrence_State_LinkedInputs */

const en_occurrence_state_linked = /** @type {(inputs: Occurrence_State_LinkedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`receipt linked`)
};

const fr_occurrence_state_linked = /** @type {(inputs: Occurrence_State_LinkedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`facture liée`)
};

/**
* | output |
* | --- |
* | "receipt linked" |
*
* @param {Occurrence_State_LinkedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const occurrence_state_linked = /** @type {((inputs?: Occurrence_State_LinkedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Occurrence_State_LinkedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_occurrence_state_linked(inputs)
	return en_occurrence_state_linked(inputs)
});