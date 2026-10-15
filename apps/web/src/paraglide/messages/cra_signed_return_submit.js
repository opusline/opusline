/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Cra_Signed_Return_SubmitInputs */

const en_cra_signed_return_submit = /** @type {(inputs: Cra_Signed_Return_SubmitInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Record the return`)
};

const fr_cra_signed_return_submit = /** @type {(inputs: Cra_Signed_Return_SubmitInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Enregistrer le retour`)
};

/**
* | output |
* | --- |
* | "Record the return" |
*
* @param {Cra_Signed_Return_SubmitInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const cra_signed_return_submit = /** @type {((inputs?: Cra_Signed_Return_SubmitInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Cra_Signed_Return_SubmitInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_cra_signed_return_submit(inputs)
	return en_cra_signed_return_submit(inputs)
});