/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Deadlines_Feed_Vat_DescInputs */

const en_deadlines_feed_vat_desc = /** @type {(inputs: Deadlines_Feed_Vat_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The CA3 dates for your régime, the whole year ahead.`)
};

const fr_deadlines_feed_vat_desc = /** @type {(inputs: Deadlines_Feed_Vat_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Les dates de CA3 selon votre régime, l'année entière à l'avance.`)
};

/**
* | output |
* | --- |
* | "The CA3 dates for your régime, the whole year ahead." |
*
* @param {Deadlines_Feed_Vat_DescInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const deadlines_feed_vat_desc = /** @type {((inputs?: Deadlines_Feed_Vat_DescInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Deadlines_Feed_Vat_DescInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_deadlines_feed_vat_desc(inputs)
	return en_deadlines_feed_vat_desc(inputs)
});