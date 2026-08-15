/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Missions_Entries_From_WeekInputs */

const en_missions_entries_from_week = /** @type {(inputs: Missions_Entries_From_WeekInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Entries are created from the week grid.`)
};

const fr_missions_entries_from_week = /** @type {(inputs: Missions_Entries_From_WeekInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Les entrées se créent depuis la grille de la semaine.`)
};

/**
* | output |
* | --- |
* | "Entries are created from the week grid." |
*
* @param {Missions_Entries_From_WeekInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const missions_entries_from_week = /** @type {((inputs?: Missions_Entries_From_WeekInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Missions_Entries_From_WeekInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_missions_entries_from_week(inputs)
	return en_missions_entries_from_week(inputs)
});