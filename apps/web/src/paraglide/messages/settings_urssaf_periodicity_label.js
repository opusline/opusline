/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settings_Urssaf_Periodicity_LabelInputs */



/**
* | output |
* | --- |
* | "URSSAF periodicity" |
*
* @param {Settings_Urssaf_Periodicity_LabelInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const settings_urssaf_periodicity_label = /** @type {((inputs?: Settings_Urssaf_Periodicity_LabelInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_Urssaf_Periodicity_LabelInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("Périodicité URSSAF")
	return /** @type {LocalizedString} */ ("URSSAF periodicity")
});