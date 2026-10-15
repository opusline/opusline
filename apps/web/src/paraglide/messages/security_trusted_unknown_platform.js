/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Security_Trusted_Unknown_PlatformInputs */



/**
* | output |
* | --- |
* | "unknown device" |
*
* @param {Security_Trusted_Unknown_PlatformInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const security_trusted_unknown_platform = /** @type {((inputs?: Security_Trusted_Unknown_PlatformInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Security_Trusted_Unknown_PlatformInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("appareil inconnu")
	return /** @type {LocalizedString} */ ("unknown device")
});