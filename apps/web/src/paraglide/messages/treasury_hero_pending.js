/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ amount: NonNullable<unknown> }} Treasury_Hero_PendingInputs */

const en_treasury_hero_pending = /** @type {(inputs: Treasury_Hero_PendingInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.amount} already transferred, not on a statement yet`)
};

const fr_treasury_hero_pending = /** @type {(inputs: Treasury_Hero_PendingInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.amount} déjà virés, pas encore sur un relevé`)
};

/**
* | output |
* | --- |
* | "{amount} already transferred, not on a statement yet" |
*
* @param {Treasury_Hero_PendingInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const treasury_hero_pending = /** @type {((inputs: Treasury_Hero_PendingInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Treasury_Hero_PendingInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_treasury_hero_pending(inputs)
	return en_treasury_hero_pending(inputs)
});