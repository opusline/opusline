/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Deadlines_Dialog_Address_LabelInputs */

const en_deadlines_dialog_address_label = /** @type {(inputs: Deadlines_Dialog_Address_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Subscription address`)
};

const fr_deadlines_dialog_address_label = /** @type {(inputs: Deadlines_Dialog_Address_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Adresse d'abonnement`)
};

/**
* | output |
* | --- |
* | "Subscription address" |
*
* @param {Deadlines_Dialog_Address_LabelInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const deadlines_dialog_address_label = /** @type {((inputs?: Deadlines_Dialog_Address_LabelInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Deadlines_Dialog_Address_LabelInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_deadlines_dialog_address_label(inputs)
	return en_deadlines_dialog_address_label(inputs)
});