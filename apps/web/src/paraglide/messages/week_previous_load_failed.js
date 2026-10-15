/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Week_Previous_Load_FailedInputs */

const en_week_previous_load_failed = /** @type {(inputs: Week_Previous_Load_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Last week could not be loaded. Try again in a moment.`)
};

const fr_week_previous_load_failed = /** @type {(inputs: Week_Previous_Load_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`La semaine précédente n'a pas pu être chargée. Réessayez dans un instant.`)
};

/**
* | output |
* | --- |
* | "Last week could not be loaded. Try again in a moment." |
*
* @param {Week_Previous_Load_FailedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const week_previous_load_failed = /** @type {((inputs?: Week_Previous_Load_FailedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Week_Previous_Load_FailedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_week_previous_load_failed(inputs)
	return en_week_previous_load_failed(inputs)
});