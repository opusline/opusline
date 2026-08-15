/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ max: NonNullable<unknown> }} Zod_Too_BigInputs */

const en_zod_too_big = /** @type {(inputs: Zod_Too_BigInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`At most ${i?.max} characters.`)
};

const fr_zod_too_big = /** @type {(inputs: Zod_Too_BigInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Au maximum ${i?.max} caractères.`)
};

/**
* | output |
* | --- |
* | "At most {max} characters." |
*
* @param {Zod_Too_BigInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const zod_too_big = /** @type {((inputs: Zod_Too_BigInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Zod_Too_BigInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_zod_too_big(inputs)
	return en_zod_too_big(inputs)
});