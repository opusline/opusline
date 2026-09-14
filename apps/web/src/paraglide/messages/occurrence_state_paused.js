/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Occurrence_State_PausedInputs */

const en_occurrence_state_paused = /** @type {(inputs: Occurrence_State_PausedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`paused`)
};

const fr_occurrence_state_paused = /** @type {(inputs: Occurrence_State_PausedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`en pause`)
};

/**
* | output |
* | --- |
* | "paused" |
*
* @param {Occurrence_State_PausedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const occurrence_state_paused = /** @type {((inputs?: Occurrence_State_PausedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Occurrence_State_PausedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_occurrence_state_paused(inputs)
	return en_occurrence_state_paused(inputs)
});