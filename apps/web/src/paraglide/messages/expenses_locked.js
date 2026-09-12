/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Expenses_LockedInputs */

const en_expenses_locked = /** @type {(inputs: Expenses_LockedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Locked · month filed`)
};

const fr_expenses_locked = /** @type {(inputs: Expenses_LockedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Verrouillée · mois déclaré`)
};

/**
* | output |
* | --- |
* | "Locked · month filed" |
*
* @param {Expenses_LockedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expenses_locked = /** @type {((inputs?: Expenses_LockedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expenses_LockedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expenses_locked(inputs)
	return en_expenses_locked(inputs)
});