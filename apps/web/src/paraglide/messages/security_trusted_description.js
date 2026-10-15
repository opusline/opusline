/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Security_Trusted_DescriptionInputs */



/**
* | output |
* | --- |
* | "Browsers you chose to remember skip the code for 30 days." |
*
* @param {Security_Trusted_DescriptionInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const security_trusted_description = /** @type {((inputs?: Security_Trusted_DescriptionInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Security_Trusted_DescriptionInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("Les navigateurs dont vous avez demandé le souvenir ne redemandent pas de code pendant 30 jours.")
	return /** @type {LocalizedString} */ ("Browsers you chose to remember skip the code for 30 days.")
});