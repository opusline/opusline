/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Declarations_Liberating_Ends_ActionInputs */



/**
* | output |
* | --- |
* | "Turn it off in the settings on that date." |
*
* @param {Declarations_Liberating_Ends_ActionInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const declarations_liberating_ends_action = /** @type {((inputs?: Declarations_Liberating_Ends_ActionInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Declarations_Liberating_Ends_ActionInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("Désactivez-le dans les réglages à cette date.")
	return /** @type {LocalizedString} */ ("Turn it off in the settings on that date.")
});