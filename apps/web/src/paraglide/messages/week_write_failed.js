/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Week_Write_FailedInputs */

const en_week_write_failed = /** @type {(inputs: Week_Write_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Saving failed. Try again in a moment.`)
};

const fr_week_write_failed = /** @type {(inputs: Week_Write_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`L'enregistrement a échoué. Réessayez dans un instant.`)
};

/**
* | output |
* | --- |
* | "Saving failed. Try again in a moment." |
*
* @param {Week_Write_FailedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const week_write_failed = /** @type {((inputs?: Week_Write_FailedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Week_Write_FailedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_week_write_failed(inputs)
	return en_week_write_failed(inputs)
});