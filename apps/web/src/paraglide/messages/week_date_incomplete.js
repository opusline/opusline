/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Week_Date_IncompleteInputs */

const en_week_date_incomplete = /** @type {(inputs: Week_Date_IncompleteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Incomplete date`)
};

const fr_week_date_incomplete = /** @type {(inputs: Week_Date_IncompleteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Date incomplète`)
};

/**
* | output |
* | --- |
* | "Incomplete date" |
*
* @param {Week_Date_IncompleteInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const week_date_incomplete = /** @type {((inputs?: Week_Date_IncompleteInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Week_Date_IncompleteInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_week_date_incomplete(inputs)
	return en_week_date_incomplete(inputs)
});