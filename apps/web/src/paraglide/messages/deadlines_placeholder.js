/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Deadlines_PlaceholderInputs */

const en_deadlines_placeholder = /** @type {(inputs: Deadlines_PlaceholderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Deadlines land here — URSSAF, CA3, CFE, reminders.`)
};

const fr_deadlines_placeholder = /** @type {(inputs: Deadlines_PlaceholderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Les échéances arrivent ici — URSSAF, CA3, CFE, rappels.`)
};

/**
* | output |
* | --- |
* | "Deadlines land here — URSSAF, CA3, CFE, reminders." |
*
* @param {Deadlines_PlaceholderInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const deadlines_placeholder = /** @type {((inputs?: Deadlines_PlaceholderInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Deadlines_PlaceholderInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_deadlines_placeholder(inputs)
	return en_deadlines_placeholder(inputs)
});