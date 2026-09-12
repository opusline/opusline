/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Occurrence_State_FutureInputs */

const en_occurrence_state_future = /** @type {(inputs: Occurrence_State_FutureInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`upcoming`)
};

const fr_occurrence_state_future = /** @type {(inputs: Occurrence_State_FutureInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`à venir`)
};

/**
* | output |
* | --- |
* | "upcoming" |
*
* @param {Occurrence_State_FutureInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const occurrence_state_future = /** @type {((inputs?: Occurrence_State_FutureInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Occurrence_State_FutureInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_occurrence_state_future(inputs)
	return en_occurrence_state_future(inputs)
});