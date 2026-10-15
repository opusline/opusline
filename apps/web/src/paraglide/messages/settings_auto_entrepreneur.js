/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settings_Auto_EntrepreneurInputs */



/**
* | output |
* | --- |
* | "Auto-entrepreneur" |
*
* @param {Settings_Auto_EntrepreneurInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const settings_auto_entrepreneur = /** @type {((inputs?: Settings_Auto_EntrepreneurInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_Auto_EntrepreneurInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("Auto-entrepreneur")
	return /** @type {LocalizedString} */ ("Auto-entrepreneur")
});