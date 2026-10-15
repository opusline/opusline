/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Deadlines_Dialog_Intro_SubscribedInputs */



/**
* | output |
* | --- |
* | "Your calendar polls this address several times a day. New deadlines, moved dates and collected invoices carry over without doing anything." |
*
* @param {Deadlines_Dialog_Intro_SubscribedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const deadlines_dialog_intro_subscribed = /** @type {((inputs?: Deadlines_Dialog_Intro_SubscribedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Deadlines_Dialog_Intro_SubscribedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("Votre calendrier interroge cette adresse plusieurs fois par jour. Les nouvelles échéances, les dates modifiées et les factures encaissées s'y répercutent sans rien faire.")
	return /** @type {LocalizedString} */ ("Your calendar polls this address several times a day. New deadlines, moved dates and collected invoices carry over without doing anything.")
});