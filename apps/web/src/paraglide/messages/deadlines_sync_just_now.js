/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Deadlines_Sync_Just_NowInputs */

const en_deadlines_sync_just_now = /** @type {(inputs: Deadlines_Sync_Just_NowInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Last synchronised just now`)
};

const fr_deadlines_sync_just_now = /** @type {(inputs: Deadlines_Sync_Just_NowInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Dernière synchronisation à l'instant`)
};

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
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_deadlines_sync_just_now(inputs)
	return en_deadlines_sync_just_now(inputs)
});