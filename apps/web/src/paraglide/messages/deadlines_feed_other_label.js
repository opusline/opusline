/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Deadlines_Feed_Other_LabelInputs */

const en_deadlines_feed_other_label = /** @type {(inputs: Deadlines_Feed_Other_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Other fiscal deadlines`)
};

const fr_deadlines_feed_other_label = /** @type {(inputs: Deadlines_Feed_Other_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Autres échéances fiscales`)
};

/**
* | output |
* | --- |
* | "Other fiscal deadlines" |
*
* @param {Deadlines_Feed_Other_LabelInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const deadlines_feed_other_label = /** @type {((inputs?: Deadlines_Feed_Other_LabelInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Deadlines_Feed_Other_LabelInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_deadlines_feed_other_label(inputs)
	return en_deadlines_feed_other_label(inputs)
});