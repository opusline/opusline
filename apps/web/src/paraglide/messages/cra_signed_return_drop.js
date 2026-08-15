/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Cra_Signed_Return_DropInputs */

const en_cra_signed_return_drop = /** @type {(inputs: Cra_Signed_Return_DropInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Drop the signed CRA`)
};

const fr_cra_signed_return_drop = /** @type {(inputs: Cra_Signed_Return_DropInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Déposer le CRA signé`)
};

/**
* | output |
* | --- |
* | "Drop the signed CRA" |
*
* @param {Cra_Signed_Return_DropInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const cra_signed_return_drop = /** @type {((inputs?: Cra_Signed_Return_DropInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Cra_Signed_Return_DropInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_cra_signed_return_drop(inputs)
	return en_cra_signed_return_drop(inputs)
});