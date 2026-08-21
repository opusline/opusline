/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ date: NonNullable<unknown> }} Treasury_Delete_AriaInputs */

const en_treasury_delete_aria = /** @type {(inputs: Treasury_Delete_AriaInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Delete the transfer of ${i?.date}`)
};

const fr_treasury_delete_aria = /** @type {(inputs: Treasury_Delete_AriaInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Supprimer le virement du ${i?.date}`)
};

/**
* | output |
* | --- |
* | "Delete the transfer of {date}" |
*
* @param {Treasury_Delete_AriaInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const treasury_delete_aria = /** @type {((inputs: Treasury_Delete_AriaInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Treasury_Delete_AriaInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_treasury_delete_aria(inputs)
	return en_treasury_delete_aria(inputs)
});