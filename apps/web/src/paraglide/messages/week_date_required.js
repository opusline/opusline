/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Week_Date_RequiredInputs */

const en_week_date_required = /** @type {(inputs: Week_Date_RequiredInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Enter a date.`)
};

const fr_week_date_required = /** @type {(inputs: Week_Date_RequiredInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Indiquez une date.`)
};

/**
* | output |
* | --- |
* | "Enter a date." |
*
* @param {Week_Date_RequiredInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const week_date_required = /** @type {((inputs?: Week_Date_RequiredInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Week_Date_RequiredInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_week_date_required(inputs)
	return en_week_date_required(inputs)
});