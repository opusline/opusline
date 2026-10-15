/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Week_No_ActivityInputs */

const en_week_no_activity = /** @type {(inputs: Week_No_ActivityInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No activity`)
};

const fr_week_no_activity = /** @type {(inputs: Week_No_ActivityInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Sans activité`)
};

/**
* | output |
* | --- |
* | "No activity" |
*
* @param {Week_No_ActivityInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const week_no_activity = /** @type {((inputs?: Week_No_ActivityInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Week_No_ActivityInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_week_no_activity(inputs)
	return en_week_no_activity(inputs)
});