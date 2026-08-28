/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Deadlines_Sync_WaitingInputs */

const en_deadlines_sync_waiting = /** @type {(inputs: Deadlines_Sync_WaitingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Waiting for the first synchronisation`)
};

const fr_deadlines_sync_waiting = /** @type {(inputs: Deadlines_Sync_WaitingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`En attente de la première synchronisation`)
};

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
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_deadlines_sync_waiting(inputs)
	return en_deadlines_sync_waiting(inputs)
});