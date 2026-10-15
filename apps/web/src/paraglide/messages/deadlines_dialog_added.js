/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Deadlines_Dialog_AddedInputs */

const en_deadlines_dialog_added = /** @type {(inputs: Deadlines_Dialog_AddedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`I have added the address`)
};

const fr_deadlines_dialog_added = /** @type {(inputs: Deadlines_Dialog_AddedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`J'ai ajouté l'adresse`)
};

/**
* | output |
* | --- |
* | "I have added the address" |
*
* @param {Deadlines_Dialog_AddedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const deadlines_dialog_added = /** @type {((inputs?: Deadlines_Dialog_AddedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Deadlines_Dialog_AddedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_deadlines_dialog_added(inputs)
	return en_deadlines_dialog_added(inputs)
});