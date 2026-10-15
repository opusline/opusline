/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Declarations_Liberating_Ended_ActionInputs */



/**
* | output |
* | --- |
* | "Turn it off in the settings." |
*
* @param {Declarations_Liberating_Ended_ActionInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const declarations_liberating_ended_action = /** @type {((inputs?: Declarations_Liberating_Ended_ActionInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Declarations_Liberating_Ended_ActionInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("Désactivez-le dans les réglages.")
	return /** @type {LocalizedString} */ ("Turn it off in the settings.")
});