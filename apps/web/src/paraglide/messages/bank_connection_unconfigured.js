/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Bank_Connection_UnconfiguredInputs */



/**
* | output |
* | --- |
* | "Get your movements every night, without exporting statements, by connecting your bank through Enable Banking." |
*
* @param {Bank_Connection_UnconfiguredInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const bank_connection_unconfigured = /** @type {((inputs?: Bank_Connection_UnconfiguredInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Bank_Connection_UnconfiguredInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("Récupérez vos mouvements chaque nuit, sans exporter de relevé, en connectant votre banque via Enable Banking.")
	return /** @type {LocalizedString} */ ("Get your movements every night, without exporting statements, by connecting your bank through Enable Banking.")
});