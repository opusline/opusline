/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Deadlines_Feed_Other_DescInputs */



/**
* | output |
* | --- |
* | "CFE and other annual notices, as soon as the date is known." |
*
* @param {Deadlines_Feed_Other_DescInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const deadlines_feed_other_desc = /** @type {((inputs?: Deadlines_Feed_Other_DescInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Deadlines_Feed_Other_DescInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("CFE et autres avis annuels, dès que la date est connue.")
	return /** @type {LocalizedString} */ ("CFE and other annual notices, as soon as the date is known.")
});