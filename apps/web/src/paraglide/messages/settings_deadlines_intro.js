/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settings_Deadlines_IntroInputs */

const en_settings_deadlines_intro = /** @type {(inputs: Settings_Deadlines_IntroInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The one figure Opusline cannot work out: the CFE your commune bills. Everything else on the deadlines calendar is derived.`)
};

const fr_settings_deadlines_intro = /** @type {(inputs: Settings_Deadlines_IntroInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Le seul montant qu'Opusline ne peut pas déduire : la CFE que votre commune facture. Tout le reste du calendrier des échéances est dérivé.`)
};

/**
* | output |
* | --- |
* | "The one figure Opusline cannot work out: the CFE your commune bills. Everything else on the deadlines calendar is derived." |
*
* @param {Settings_Deadlines_IntroInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const settings_deadlines_intro = /** @type {((inputs?: Settings_Deadlines_IntroInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_Deadlines_IntroInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_settings_deadlines_intro(inputs)
	return en_settings_deadlines_intro(inputs)
});