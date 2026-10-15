/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Week_Duration_RequiredInputs */

const en_week_duration_required = /** @type {(inputs: Week_Duration_RequiredInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Enter a duration.`)
};

const fr_week_duration_required = /** @type {(inputs: Week_Duration_RequiredInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Indiquez une durée.`)
};

/**
* | output |
* | --- |
* | "Enter a duration." |
*
* @param {Week_Duration_RequiredInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const week_duration_required = /** @type {((inputs?: Week_Duration_RequiredInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Week_Duration_RequiredInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_week_duration_required(inputs)
	return en_week_duration_required(inputs)
});