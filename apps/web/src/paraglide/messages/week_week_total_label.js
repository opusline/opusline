/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Week_Week_Total_LabelInputs */

const en_week_week_total_label = /** @type {(inputs: Week_Week_Total_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Week total`)
};

const fr_week_week_total_label = /** @type {(inputs: Week_Week_Total_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Total de la semaine`)
};

/**
* | output |
* | --- |
* | "Week total" |
*
* @param {Week_Week_Total_LabelInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const week_week_total_label = /** @type {((inputs?: Week_Week_Total_LabelInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Week_Week_Total_LabelInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_week_week_total_label(inputs)
	return en_week_week_total_label(inputs)
});