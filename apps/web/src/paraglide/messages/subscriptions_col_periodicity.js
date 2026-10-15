/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Subscriptions_Col_PeriodicityInputs */



/**
* | output |
* | --- |
* | "Periodicity" |
*
* @param {Subscriptions_Col_PeriodicityInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const subscriptions_col_periodicity = /** @type {((inputs?: Subscriptions_Col_PeriodicityInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Subscriptions_Col_PeriodicityInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("Périodicité")
	return /** @type {LocalizedString} */ ("Periodicity")
});