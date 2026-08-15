/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Missions_Tab_EntriesInputs */

const en_missions_tab_entries = /** @type {(inputs: Missions_Tab_EntriesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Entries`)
};

const fr_missions_tab_entries = /** @type {(inputs: Missions_Tab_EntriesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Entrées`)
};

/**
* | output |
* | --- |
* | "Entries" |
*
* @param {Missions_Tab_EntriesInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const missions_tab_entries = /** @type {((inputs?: Missions_Tab_EntriesInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Missions_Tab_EntriesInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_missions_tab_entries(inputs)
	return en_missions_tab_entries(inputs)
});