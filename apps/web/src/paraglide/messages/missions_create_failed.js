/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Missions_Create_FailedInputs */



/**
* | output |
* | --- |
* | "The mission could not be created. Try again in a moment." |
*
* @param {Missions_Create_FailedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const missions_create_failed = /** @type {((inputs?: Missions_Create_FailedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Missions_Create_FailedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("Impossible de créer la mission. Réessayez dans un instant.")
	return /** @type {LocalizedString} */ ("The mission could not be created. Try again in a moment.")
});