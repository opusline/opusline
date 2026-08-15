/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ hours: NonNullable<unknown> }} Missions_Preview_Hours_HintInputs */

const en_missions_preview_hours_hint = /** @type {(inputs: Missions_Preview_Hours_HintInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`over ${i?.hours} h billed · assuming a full month`)
};

const fr_missions_preview_hours_hint = /** @type {(inputs: Missions_Preview_Hours_HintInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`sur ${i?.hours} h facturées · hypothèse d'un mois plein`)
};

/**
* | output |
* | --- |
* | "over {hours} h billed · assuming a full month" |
*
* @param {Missions_Preview_Hours_HintInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const missions_preview_hours_hint = /** @type {((inputs: Missions_Preview_Hours_HintInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Missions_Preview_Hours_HintInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_missions_preview_hours_hint(inputs)
	return en_missions_preview_hours_hint(inputs)
});