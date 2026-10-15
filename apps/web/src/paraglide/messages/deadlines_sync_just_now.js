/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Deadlines_Sync_Just_NowInputs */



/**
* | output |
* | --- |
* | "Last synchronised just now" |
*
* @param {Deadlines_Sync_Just_NowInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const deadlines_sync_just_now = /** @type {((inputs?: Deadlines_Sync_Just_NowInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Deadlines_Sync_Just_NowInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("Dernière synchronisation à l'instant")
	return /** @type {LocalizedString} */ ("Last synchronised just now")
});