/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Occurrence_State_MissingInputs */

const en_occurrence_state_missing = /** @type {(inputs: Occurrence_State_MissingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`receipt missing`)
};

const fr_occurrence_state_missing = /** @type {(inputs: Occurrence_State_MissingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`facture manquante`)
};

/**
* | output |
* | --- |
* | "receipt missing" |
*
* @param {Occurrence_State_MissingInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const occurrence_state_missing = /** @type {((inputs?: Occurrence_State_MissingInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Occurrence_State_MissingInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_occurrence_state_missing(inputs)
	return en_occurrence_state_missing(inputs)
});