/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Week_New_EntryInputs */

const en_week_new_entry = /** @type {(inputs: Week_New_EntryInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`New entry`)
};

const fr_week_new_entry = /** @type {(inputs: Week_New_EntryInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Nouvelle entrée`)
};

/**
* | output |
* | --- |
* | "New entry" |
*
* @param {Week_New_EntryInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const week_new_entry = /** @type {((inputs?: Week_New_EntryInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Week_New_EntryInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_week_new_entry(inputs)
	return en_week_new_entry(inputs)
});