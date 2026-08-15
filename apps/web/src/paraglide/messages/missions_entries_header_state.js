/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Missions_Entries_Header_StateInputs */

const en_missions_entries_header_state = /** @type {(inputs: Missions_Entries_Header_StateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`State`)
};

const fr_missions_entries_header_state = /** @type {(inputs: Missions_Entries_Header_StateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`État`)
};

/**
* | output |
* | --- |
* | "State" |
*
* @param {Missions_Entries_Header_StateInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const missions_entries_header_state = /** @type {((inputs?: Missions_Entries_Header_StateInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Missions_Entries_Header_StateInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_missions_entries_header_state(inputs)
	return en_missions_entries_header_state(inputs)
});