/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ amount: NonNullable<unknown> }} Treasury_Short_BodyInputs */

const en_treasury_short_body = /** @type {(inputs: Treasury_Short_BodyInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`You are ${i?.amount} short of covering the provisions. Nothing is safe to transfer.`)
};

const fr_treasury_short_body = /** @type {(inputs: Treasury_Short_BodyInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Il manque ${i?.amount} pour couvrir les provisions. Rien n'est virable en sécurité.`)
};

/**
* | output |
* | --- |
* | "You are {amount} short of covering the provisions. Nothing is safe to transfer." |
*
* @param {Treasury_Short_BodyInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const treasury_short_body = /** @type {((inputs: Treasury_Short_BodyInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Treasury_Short_BodyInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_treasury_short_body(inputs)
	return en_treasury_short_body(inputs)
});