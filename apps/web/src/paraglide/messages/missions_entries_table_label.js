/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Missions_Entries_Table_LabelInputs */

const en_missions_entries_table_label = /** @type {(inputs: Missions_Entries_Table_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Time entries`)
};

const fr_missions_entries_table_label = /** @type {(inputs: Missions_Entries_Table_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Saisies de temps`)
};

/**
* | output |
* | --- |
* | "Time entries" |
*
* @param {Missions_Entries_Table_LabelInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const missions_entries_table_label = /** @type {((inputs?: Missions_Entries_Table_LabelInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Missions_Entries_Table_LabelInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_missions_entries_table_label(inputs)
	return en_missions_entries_table_label(inputs)
});