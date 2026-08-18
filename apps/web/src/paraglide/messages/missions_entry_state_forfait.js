/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Missions_Entry_State_ForfaitInputs */

const en_missions_entry_state_forfait = /** @type {(inputs: Missions_Entry_State_ForfaitInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Fixed price`)
};

const fr_missions_entry_state_forfait = /** @type {(inputs: Missions_Entry_State_ForfaitInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Forfait`)
};

/**
* | output |
* | --- |
* | "Fixed price" |
*
* @param {Missions_Entry_State_ForfaitInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const missions_entry_state_forfait = /** @type {((inputs?: Missions_Entry_State_ForfaitInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Missions_Entry_State_ForfaitInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_missions_entry_state_forfait(inputs)
	return en_missions_entry_state_forfait(inputs)
});