/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Missions_Load_Clients_FailedInputs */



/**
* | output |
* | --- |
* | "Your clients could not be loaded. Try again in a moment." |
*
* @param {Missions_Load_Clients_FailedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const missions_load_clients_failed = /** @type {((inputs?: Missions_Load_Clients_FailedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Missions_Load_Clients_FailedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("Impossible de charger vos clients. Réessayez dans un instant.")
	return /** @type {LocalizedString} */ ("Your clients could not be loaded. Try again in a moment.")
});