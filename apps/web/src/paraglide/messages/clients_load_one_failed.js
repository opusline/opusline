/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Clients_Load_One_FailedInputs */



/**
* | output |
* | --- |
* | "This client could not be loaded. Try again in a moment." |
*
* @param {Clients_Load_One_FailedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const clients_load_one_failed = /** @type {((inputs?: Clients_Load_One_FailedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Clients_Load_One_FailedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("Impossible de charger ce client. Réessayez dans un instant.")
	return /** @type {LocalizedString} */ ("This client could not be loaded. Try again in a moment.")
});