/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Missions_Schedule_HintInputs */

const en_missions_schedule_hint = /** @type {(inputs: Missions_Schedule_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Optional. Split the fixed price into the instalments you will bill, and each one will remind you when its date comes or when you mark it ready.`)
};

const fr_missions_schedule_hint = /** @type {(inputs: Missions_Schedule_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Facultatif. Découpez le forfait en échéances à facturer : chacune vous relance à sa date ou quand vous la marquez prête.`)
};

/**
* | output |
* | --- |
* | "Optional. Split the fixed price into the instalments you will bill, and each one will remind you when its date comes or when you mark it ready." |
*
* @param {Missions_Schedule_HintInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const missions_schedule_hint = /** @type {((inputs?: Missions_Schedule_HintInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Missions_Schedule_HintInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_missions_schedule_hint(inputs)
	return en_missions_schedule_hint(inputs)
});