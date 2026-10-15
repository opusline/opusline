/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settings_Deadlines_IntroInputs */



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
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("Le seul montant qu'Opusline ne peut pas déduire : la CFE que votre commune facture. Tout le reste du calendrier des échéances est dérivé.")
	return /** @type {LocalizedString} */ ("The one figure Opusline cannot work out: the CFE your commune bills. Everything else on the deadlines calendar is derived.")
});