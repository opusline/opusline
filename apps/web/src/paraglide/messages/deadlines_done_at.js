/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ date: NonNullable<unknown> }} Deadlines_Done_AtInputs */

const en_deadlines_done_at = /** @type {(inputs: Deadlines_Done_AtInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`on ${i?.date}`)
};

const fr_deadlines_done_at = /** @type {(inputs: Deadlines_Done_AtInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`le ${i?.date}`)
};

/**
* | output |
* | --- |
* | "on {date}" |
*
* @param {Deadlines_Done_AtInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const deadlines_done_at = /** @type {((inputs: Deadlines_Done_AtInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Deadlines_Done_AtInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_deadlines_done_at(inputs)
	return en_deadlines_done_at(inputs)
});