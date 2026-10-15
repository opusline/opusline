/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Deadlines_Sync_WaitingInputs */



/**
* | output |
* | --- |
* | "Waiting for the first synchronisation" |
*
* @param {Deadlines_Sync_WaitingInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const deadlines_sync_waiting = /** @type {((inputs?: Deadlines_Sync_WaitingInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Deadlines_Sync_WaitingInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("En attente de la première synchronisation")
	return /** @type {LocalizedString} */ ("Waiting for the first synchronisation")
});