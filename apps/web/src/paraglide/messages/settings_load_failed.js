/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settings_Load_FailedInputs */



/**
* | output |
* | --- |
* | "The settings could not be loaded." |
*
* @param {Settings_Load_FailedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const settings_load_failed = /** @type {((inputs?: Settings_Load_FailedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_Load_FailedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("Les réglages n'ont pas pu être chargés.")
	return /** @type {LocalizedString} */ ("The settings could not be loaded.")
});