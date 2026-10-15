/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Deadlines_InterruptInputs */

const en_deadlines_interrupt = /** @type {(inputs: Deadlines_InterruptInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Stop`)
};

const fr_deadlines_interrupt = /** @type {(inputs: Deadlines_InterruptInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Interrompre`)
};

/**
* | output |
* | --- |
* | "Stop" |
*
* @param {Deadlines_InterruptInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const deadlines_interrupt = /** @type {((inputs?: Deadlines_InterruptInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Deadlines_InterruptInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_deadlines_interrupt(inputs)
	return en_deadlines_interrupt(inputs)
});