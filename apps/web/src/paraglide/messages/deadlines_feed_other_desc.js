/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Deadlines_Feed_Other_DescInputs */

const en_deadlines_feed_other_desc = /** @type {(inputs: Deadlines_Feed_Other_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`CFE and other annual notices, as soon as the date is known.`)
};

const fr_deadlines_feed_other_desc = /** @type {(inputs: Deadlines_Feed_Other_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`CFE et autres avis annuels, dès que la date est connue.`)
};

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
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_deadlines_feed_other_desc(inputs)
	return en_deadlines_feed_other_desc(inputs)
});