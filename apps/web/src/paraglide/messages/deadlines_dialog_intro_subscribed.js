/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Deadlines_Dialog_Intro_SubscribedInputs */

const en_deadlines_dialog_intro_subscribed = /** @type {(inputs: Deadlines_Dialog_Intro_SubscribedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Your calendar polls this address several times a day. New deadlines, moved dates and collected invoices carry over without doing anything.`)
};

const fr_deadlines_dialog_intro_subscribed = /** @type {(inputs: Deadlines_Dialog_Intro_SubscribedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Votre calendrier interroge cette adresse plusieurs fois par jour. Les nouvelles échéances, les dates modifiées et les factures encaissées s'y répercutent sans rien faire.`)
};

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
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_deadlines_dialog_intro_subscribed(inputs)
	return en_deadlines_dialog_intro_subscribed(inputs)
});