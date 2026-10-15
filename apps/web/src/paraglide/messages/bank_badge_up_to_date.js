/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Bank_Badge_Up_To_DateInputs */



/**
* | output |
* | --- |
* | "Up to date" |
*
* @param {Bank_Badge_Up_To_DateInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const bank_badge_up_to_date = /** @type {((inputs?: Bank_Badge_Up_To_DateInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Bank_Badge_Up_To_DateInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("À jour")
	return /** @type {LocalizedString} */ ("Up to date")
});