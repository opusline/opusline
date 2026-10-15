/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Cra_State_Drift_To_CheckInputs */



/**
* | output |
* | --- |
* | "A drift to check" |
*
* @param {Cra_State_Drift_To_CheckInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const cra_state_drift_to_check = /** @type {((inputs?: Cra_State_Drift_To_CheckInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Cra_State_Drift_To_CheckInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("Un écart à vérifier")
	return /** @type {LocalizedString} */ ("A drift to check")
});