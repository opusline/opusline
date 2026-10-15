/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Missions_Entries_EmptyInputs */

const en_missions_entries_empty = /** @type {(inputs: Missions_Entries_EmptyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No entries yet.`)
};

const fr_missions_entries_empty = /** @type {(inputs: Missions_Entries_EmptyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Aucune entrée pour le moment.`)
};

/**
* | output |
* | --- |
* | "No entries yet." |
*
* @param {Missions_Entries_EmptyInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const missions_entries_empty = /** @type {((inputs?: Missions_Entries_EmptyInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Missions_Entries_EmptyInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_missions_entries_empty(inputs)
	return en_missions_entries_empty(inputs)
});