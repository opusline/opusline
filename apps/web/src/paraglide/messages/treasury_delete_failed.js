/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Treasury_Delete_FailedInputs */

const en_treasury_delete_failed = /** @type {(inputs: Treasury_Delete_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The transfer could not be deleted.`)
};

const fr_treasury_delete_failed = /** @type {(inputs: Treasury_Delete_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Le virement n'a pas pu être supprimé.`)
};

/**
* | output |
* | --- |
* | "The transfer could not be deleted." |
*
* @param {Treasury_Delete_FailedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const treasury_delete_failed = /** @type {((inputs?: Treasury_Delete_FailedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Treasury_Delete_FailedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_treasury_delete_failed(inputs)
	return en_treasury_delete_failed(inputs)
});