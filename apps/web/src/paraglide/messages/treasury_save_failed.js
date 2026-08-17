/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Treasury_Save_FailedInputs */

const en_treasury_save_failed = /** @type {(inputs: Treasury_Save_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Could not record the transfer.`)
};

const fr_treasury_save_failed = /** @type {(inputs: Treasury_Save_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Impossible d'enregistrer le virement.`)
};

/**
* | output |
* | --- |
* | "Could not record the transfer." |
*
* @param {Treasury_Save_FailedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const treasury_save_failed = /** @type {((inputs?: Treasury_Save_FailedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Treasury_Save_FailedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_treasury_save_failed(inputs)
	return en_treasury_save_failed(inputs)
});