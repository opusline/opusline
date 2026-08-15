/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Week_Delete_EntryInputs */

const en_week_delete_entry = /** @type {(inputs: Week_Delete_EntryInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Delete this entry`)
};

const fr_week_delete_entry = /** @type {(inputs: Week_Delete_EntryInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Supprimer cette entrée`)
};

/**
* | output |
* | --- |
* | "Delete this entry" |
*
* @param {Week_Delete_EntryInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const week_delete_entry = /** @type {((inputs?: Week_Delete_EntryInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Week_Delete_EntryInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_week_delete_entry(inputs)
	return en_week_delete_entry(inputs)
});