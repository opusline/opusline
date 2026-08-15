/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ min: NonNullable<unknown> }} Zod_Too_SmallInputs */

const en_zod_too_small = /** @type {(inputs: Zod_Too_SmallInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`At least ${i?.min} characters.`)
};

const fr_zod_too_small = /** @type {(inputs: Zod_Too_SmallInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Au moins ${i?.min} caractères.`)
};

/**
* | output |
* | --- |
* | "At least {min} characters." |
*
* @param {Zod_Too_SmallInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const zod_too_small = /** @type {((inputs: Zod_Too_SmallInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Zod_Too_SmallInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_zod_too_small(inputs)
	return en_zod_too_small(inputs)
});