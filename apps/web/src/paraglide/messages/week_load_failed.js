/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Week_Load_FailedInputs */

const en_week_load_failed = /** @type {(inputs: Week_Load_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The week could not be loaded. Try again in a moment.`)
};

const fr_week_load_failed = /** @type {(inputs: Week_Load_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Impossible de charger la semaine. Réessayez dans un instant.`)
};

/**
* | output |
* | --- |
* | "The week could not be loaded. Try again in a moment." |
*
* @param {Week_Load_FailedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const week_load_failed = /** @type {((inputs?: Week_Load_FailedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Week_Load_FailedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_week_load_failed(inputs)
	return en_week_load_failed(inputs)
});