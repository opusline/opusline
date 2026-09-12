/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settings_Currency_LockedInputs */

const en_settings_currency_locked = /** @type {(inputs: Settings_Currency_LockedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Locked: an amount has already been recorded in this currency.`)
};

const fr_settings_currency_locked = /** @type {(inputs: Settings_Currency_LockedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Fixée : un montant a déjà été enregistré dans cette devise.`)
};

/**
* | output |
* | --- |
* | "Locked: an amount has already been recorded in this currency." |
*
* @param {Settings_Currency_LockedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const settings_currency_locked = /** @type {((inputs?: Settings_Currency_LockedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_Currency_LockedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_settings_currency_locked(inputs)
	return en_settings_currency_locked(inputs)
});