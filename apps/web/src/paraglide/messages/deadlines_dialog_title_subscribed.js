/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Deadlines_Dialog_Title_SubscribedInputs */



/**
* | output |
* | --- |
* | "Calendar subscription" |
*
* @param {Deadlines_Dialog_Title_SubscribedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const deadlines_dialog_title_subscribed = /** @type {((inputs?: Deadlines_Dialog_Title_SubscribedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Deadlines_Dialog_Title_SubscribedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("Abonnement au calendrier")
	return /** @type {LocalizedString} */ ("Calendar subscription")
});