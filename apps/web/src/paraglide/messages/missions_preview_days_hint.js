/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ days: NonNullable<unknown> }} Missions_Preview_Days_HintInputs */

const en_missions_preview_days_hint = /** @type {(inputs: Missions_Preview_Days_HintInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`over ${i?.days} billed days · assuming a full month`)
};

const fr_missions_preview_days_hint = /** @type {(inputs: Missions_Preview_Days_HintInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`sur ${i?.days} jours facturés · hypothèse d'un mois plein`)
};

/**
* | output |
* | --- |
* | "over {days} billed days · assuming a full month" |
*
* @param {Missions_Preview_Days_HintInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const missions_preview_days_hint = /** @type {((inputs: Missions_Preview_Days_HintInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Missions_Preview_Days_HintInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_missions_preview_days_hint(inputs)
	return en_missions_preview_days_hint(inputs)
});