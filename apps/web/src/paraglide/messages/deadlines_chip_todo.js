/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Deadlines_Chip_TodoInputs */

const en_deadlines_chip_todo = /** @type {(inputs: Deadlines_Chip_TodoInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`To send`)
};

const fr_deadlines_chip_todo = /** @type {(inputs: Deadlines_Chip_TodoInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`À faire`)
};

/**
* | output |
* | --- |
* | "To send" |
*
* @param {Deadlines_Chip_TodoInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const deadlines_chip_todo = /** @type {((inputs?: Deadlines_Chip_TodoInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Deadlines_Chip_TodoInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_deadlines_chip_todo(inputs)
	return en_deadlines_chip_todo(inputs)
});