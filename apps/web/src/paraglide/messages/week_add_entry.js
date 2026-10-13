/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Week_Add_EntryInputs */

const en_week_add_entry = /** @type {(inputs: Week_Add_EntryInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Add an entry`)
};

const fr_week_add_entry = /** @type {(inputs: Week_Add_EntryInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ajouter une entrée`)
};

/**
* | output |
* | --- |
* | "Add an entry" |
*
* @param {Week_Add_EntryInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const week_add_entry = /** @type {((inputs?: Week_Add_EntryInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Week_Add_EntryInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_week_add_entry(inputs)
	return en_week_add_entry(inputs)
});