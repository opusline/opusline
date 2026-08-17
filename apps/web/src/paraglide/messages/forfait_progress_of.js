/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ price: NonNullable<unknown> }} Forfait_Progress_OfInputs */

const en_forfait_progress_of = /** @type {(inputs: Forfait_Progress_OfInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`of ${i?.price} agreed`)
};

const fr_forfait_progress_of = /** @type {(inputs: Forfait_Progress_OfInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`sur ${i?.price} convenus`)
};

/**
* | output |
* | --- |
* | "of {price} agreed" |
*
* @param {Forfait_Progress_OfInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const forfait_progress_of = /** @type {((inputs: Forfait_Progress_OfInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Forfait_Progress_OfInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_forfait_progress_of(inputs)
	return en_forfait_progress_of(inputs)
});