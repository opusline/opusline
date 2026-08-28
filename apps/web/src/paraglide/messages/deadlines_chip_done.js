/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Deadlines_Chip_DoneInputs */

const en_deadlines_chip_done = /** @type {(inputs: Deadlines_Chip_DoneInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Done`)
};

const fr_deadlines_chip_done = /** @type {(inputs: Deadlines_Chip_DoneInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Faite`)
};

/**
* | output |
* | --- |
* | "Done" |
*
* @param {Deadlines_Chip_DoneInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const deadlines_chip_done = /** @type {((inputs?: Deadlines_Chip_DoneInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Deadlines_Chip_DoneInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_deadlines_chip_done(inputs)
	return en_deadlines_chip_done(inputs)
});