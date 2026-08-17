/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Missions_Entries_Load_FailedInputs */

const en_missions_entries_load_failed = /** @type {(inputs: Missions_Entries_Load_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Could not load this mission's entries.`)
};

const fr_missions_entries_load_failed = /** @type {(inputs: Missions_Entries_Load_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Impossible de charger les entrées de cette mission.`)
};

/**
* | output |
* | --- |
* | "Could not load this mission's entries." |
*
* @param {Missions_Entries_Load_FailedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const missions_entries_load_failed = /** @type {((inputs?: Missions_Entries_Load_FailedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Missions_Entries_Load_FailedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_missions_entries_load_failed(inputs)
	return en_missions_entries_load_failed(inputs)
});