/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ amount: NonNullable<unknown> }} Treasury_Hero_ShortInputs */

const en_treasury_hero_short = /** @type {(inputs: Treasury_Hero_ShortInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Your provisions outgrow the account: ${i?.amount} short before anything can be transferred.`)
};

const fr_treasury_hero_short = /** @type {(inputs: Treasury_Hero_ShortInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Les provisions dépassent le solde : il manque ${i?.amount} avant tout virement.`)
};

/**
* | output |
* | --- |
* | "Your provisions outgrow the account: {amount} short before anything can be transferred." |
*
* @param {Treasury_Hero_ShortInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const treasury_hero_short = /** @type {((inputs: Treasury_Hero_ShortInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Treasury_Hero_ShortInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_treasury_hero_short(inputs)
	return en_treasury_hero_short(inputs)
});