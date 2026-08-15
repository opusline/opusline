/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Cra_Group_SignedInputs */

const en_cra_group_signed = /** @type {(inputs: Cra_Group_SignedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Signed`)
};

const fr_cra_group_signed = /** @type {(inputs: Cra_Group_SignedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Signés`)
};

/**
* | output |
* | --- |
* | "Signed" |
*
* @param {Cra_Group_SignedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const cra_group_signed = /** @type {((inputs?: Cra_Group_SignedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Cra_Group_SignedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_cra_group_signed(inputs)
	return en_cra_group_signed(inputs)
});