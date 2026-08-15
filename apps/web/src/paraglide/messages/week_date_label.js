/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Week_Date_LabelInputs */

const en_week_date_label = /** @type {(inputs: Week_Date_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Date`)
};

const fr_week_date_label = /** @type {(inputs: Week_Date_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Date`)
};

/**
* | output |
* | --- |
* | "Date" |
*
* @param {Week_Date_LabelInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const week_date_label = /** @type {((inputs?: Week_Date_LabelInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Week_Date_LabelInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_week_date_label(inputs)
	return en_week_date_label(inputs)
});