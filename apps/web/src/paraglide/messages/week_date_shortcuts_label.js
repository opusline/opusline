/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Week_Date_Shortcuts_LabelInputs */



/**
* | output |
* | --- |
* | "Date shortcuts" |
*
* @param {Week_Date_Shortcuts_LabelInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const week_date_shortcuts_label = /** @type {((inputs?: Week_Date_Shortcuts_LabelInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Week_Date_Shortcuts_LabelInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("Raccourcis de date")
	return /** @type {LocalizedString} */ ("Date shortcuts")
});