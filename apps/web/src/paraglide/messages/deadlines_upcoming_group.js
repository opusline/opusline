/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Deadlines_Upcoming_GroupInputs */

const en_deadlines_upcoming_group = /** @type {(inputs: Deadlines_Upcoming_GroupInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Coming up`)
};

const fr_deadlines_upcoming_group = /** @type {(inputs: Deadlines_Upcoming_GroupInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`À venir`)
};

/**
* | output |
* | --- |
* | "Coming up" |
*
* @param {Deadlines_Upcoming_GroupInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const deadlines_upcoming_group = /** @type {((inputs?: Deadlines_Upcoming_GroupInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Deadlines_Upcoming_GroupInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_deadlines_upcoming_group(inputs)
	return en_deadlines_upcoming_group(inputs)
});