/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Missions_Entries_Header_DurationInputs */

const en_missions_entries_header_duration = /** @type {(inputs: Missions_Entries_Header_DurationInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Duration`)
};

const fr_missions_entries_header_duration = /** @type {(inputs: Missions_Entries_Header_DurationInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Durée`)
};

/**
* | output |
* | --- |
* | "Duration" |
*
* @param {Missions_Entries_Header_DurationInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const missions_entries_header_duration = /** @type {((inputs?: Missions_Entries_Header_DurationInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Missions_Entries_Header_DurationInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_missions_entries_header_duration(inputs)
	return en_missions_entries_header_duration(inputs)
});