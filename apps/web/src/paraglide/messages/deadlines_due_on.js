/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ date: NonNullable<unknown> }} Deadlines_Due_OnInputs */

const en_deadlines_due_on = /** @type {(inputs: Deadlines_Due_OnInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Due ${i?.date}`)
};

const fr_deadlines_due_on = /** @type {(inputs: Deadlines_Due_OnInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Échéance ${i?.date}`)
};

/**
* | output |
* | --- |
* | "Due {date}" |
*
* @param {Deadlines_Due_OnInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const deadlines_due_on = /** @type {((inputs: Deadlines_Due_OnInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Deadlines_Due_OnInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_deadlines_due_on(inputs)
	return en_deadlines_due_on(inputs)
});