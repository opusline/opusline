/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Deadlines_Manage_ButtonInputs */

const en_deadlines_manage_button = /** @type {(inputs: Deadlines_Manage_ButtonInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Manage the subscription`)
};

const fr_deadlines_manage_button = /** @type {(inputs: Deadlines_Manage_ButtonInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Gérer l'abonnement`)
};

/**
* | output |
* | --- |
* | "Manage the subscription" |
*
* @param {Deadlines_Manage_ButtonInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const deadlines_manage_button = /** @type {((inputs?: Deadlines_Manage_ButtonInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Deadlines_Manage_ButtonInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_deadlines_manage_button(inputs)
	return en_deadlines_manage_button(inputs)
});