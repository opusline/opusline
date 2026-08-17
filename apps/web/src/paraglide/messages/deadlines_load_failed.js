/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Deadlines_Load_FailedInputs */

const en_deadlines_load_failed = /** @type {(inputs: Deadlines_Load_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Could not load your deadlines.`)
};

const fr_deadlines_load_failed = /** @type {(inputs: Deadlines_Load_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Impossible de charger vos échéances.`)
};

/**
* | output |
* | --- |
* | "Could not load your deadlines." |
*
* @param {Deadlines_Load_FailedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const deadlines_load_failed = /** @type {((inputs?: Deadlines_Load_FailedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Deadlines_Load_FailedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_deadlines_load_failed(inputs)
	return en_deadlines_load_failed(inputs)
});