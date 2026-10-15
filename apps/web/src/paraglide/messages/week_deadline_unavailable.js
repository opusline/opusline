/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Week_Deadline_UnavailableInputs */

const en_week_deadline_unavailable = /** @type {(inputs: Week_Deadline_UnavailableInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`could not be loaded`)
};

const fr_week_deadline_unavailable = /** @type {(inputs: Week_Deadline_UnavailableInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`n’a pas pu être chargée`)
};

/**
* | output |
* | --- |
* | "could not be loaded" |
*
* @param {Week_Deadline_UnavailableInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const week_deadline_unavailable = /** @type {((inputs?: Week_Deadline_UnavailableInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Week_Deadline_UnavailableInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_week_deadline_unavailable(inputs)
	return en_week_deadline_unavailable(inputs)
});