/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Week_Weekend_CollapsedInputs */



/**
* | output |
* | --- |
* | "Weekend collapsed" |
*
* @param {Week_Weekend_CollapsedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const week_weekend_collapsed = /** @type {((inputs?: Week_Weekend_CollapsedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Week_Weekend_CollapsedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("Week-end replié")
	return /** @type {LocalizedString} */ ("Weekend collapsed")
});