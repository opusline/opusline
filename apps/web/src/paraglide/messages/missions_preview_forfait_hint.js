/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Missions_Preview_Forfait_HintInputs */

const en_missions_preview_forfait_hint = /** @type {(inputs: Missions_Preview_Forfait_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`fixed price, billed once`)
};

const fr_missions_preview_forfait_hint = /** @type {(inputs: Missions_Preview_Forfait_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`montant du forfait, facturé en une fois`)
};

/**
* | output |
* | --- |
* | "fixed price, billed once" |
*
* @param {Missions_Preview_Forfait_HintInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const missions_preview_forfait_hint = /** @type {((inputs?: Missions_Preview_Forfait_HintInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Missions_Preview_Forfait_HintInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_missions_preview_forfait_hint(inputs)
	return en_missions_preview_forfait_hint(inputs)
});