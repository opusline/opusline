/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Deadlines_Feed_Urssaf_DescInputs */

const en_deadlines_feed_urssaf_desc = /** @type {(inputs: Deadlines_Feed_Urssaf_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The contribution deadlines, declaration and payment.`)
};

const fr_deadlines_feed_urssaf_desc = /** @type {(inputs: Deadlines_Feed_Urssaf_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Les échéances de cotisations, déclaration et prélèvement.`)
};

/**
* | output |
* | --- |
* | "The contribution deadlines, declaration and payment." |
*
* @param {Deadlines_Feed_Urssaf_DescInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const deadlines_feed_urssaf_desc = /** @type {((inputs?: Deadlines_Feed_Urssaf_DescInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Deadlines_Feed_Urssaf_DescInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_deadlines_feed_urssaf_desc(inputs)
	return en_deadlines_feed_urssaf_desc(inputs)
});