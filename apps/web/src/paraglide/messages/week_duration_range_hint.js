/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Week_Duration_Range_HintInputs */

const en_week_duration_range_hint = /** @type {(inputs: Week_Duration_Range_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`An entry runs from 1 minute to 24 hours.`)
};

const fr_week_duration_range_hint = /** @type {(inputs: Week_Duration_Range_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Une entrée va de 1 minute à 24 heures.`)
};

/**
* | output |
* | --- |
* | "An entry runs from 1 minute to 24 hours." |
*
* @param {Week_Duration_Range_HintInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const week_duration_range_hint = /** @type {((inputs?: Week_Duration_Range_HintInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Week_Duration_Range_HintInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_week_duration_range_hint(inputs)
	return en_week_duration_range_hint(inputs)
});