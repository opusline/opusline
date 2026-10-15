/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Treasury_Delete_ConfirmInputs */

const en_treasury_delete_confirm = /** @type {(inputs: Treasury_Delete_ConfirmInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Delete the transfer`)
};

const fr_treasury_delete_confirm = /** @type {(inputs: Treasury_Delete_ConfirmInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Supprimer le virement`)
};

/**
* | output |
* | --- |
* | "Delete the transfer" |
*
* @param {Treasury_Delete_ConfirmInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const treasury_delete_confirm = /** @type {((inputs?: Treasury_Delete_ConfirmInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Treasury_Delete_ConfirmInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_treasury_delete_confirm(inputs)
	return en_treasury_delete_confirm(inputs)
});