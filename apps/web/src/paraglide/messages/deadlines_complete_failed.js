/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Deadlines_Complete_FailedInputs */

const en_deadlines_complete_failed = /** @type {(inputs: Deadlines_Complete_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`This deadline could not be updated.`)
};

const fr_deadlines_complete_failed = /** @type {(inputs: Deadlines_Complete_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Cette échéance n’a pas pu être mise à jour.`)
};

/**
* | output |
* | --- |
* | "This deadline could not be updated." |
*
* @param {Deadlines_Complete_FailedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const deadlines_complete_failed = /** @type {((inputs?: Deadlines_Complete_FailedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Deadlines_Complete_FailedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_deadlines_complete_failed(inputs)
	return en_deadlines_complete_failed(inputs)
});