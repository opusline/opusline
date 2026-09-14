/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ date: NonNullable<unknown> }} Declarations_Cfe_DeadlineInputs */

const en_declarations_cfe_deadline = /** @type {(inputs: Declarations_Cfe_DeadlineInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.date} · notice online mid-November`)
};

const fr_declarations_cfe_deadline = /** @type {(inputs: Declarations_Cfe_DeadlineInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.date} · avis en ligne mi-novembre`)
};

/**
* | output |
* | --- |
* | "{date} · notice online mid-November" |
*
* @param {Declarations_Cfe_DeadlineInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const declarations_cfe_deadline = /** @type {((inputs: Declarations_Cfe_DeadlineInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Declarations_Cfe_DeadlineInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_declarations_cfe_deadline(inputs)
	return en_declarations_cfe_deadline(inputs)
});