/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ amount: NonNullable<unknown> }} Treasury_Hero_Pending_DeclarationsInputs */

const en_treasury_hero_pending_declarations = /** @type {(inputs: Treasury_Hero_Pending_DeclarationsInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.amount} of tax returns already paid, not on a statement yet`)
};

const fr_treasury_hero_pending_declarations = /** @type {(inputs: Treasury_Hero_Pending_DeclarationsInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.amount} de déclarations déjà payées, pas encore sur un relevé`)
};

/**
* | output |
* | --- |
* | "{amount} of tax returns already paid, not on a statement yet" |
*
* @param {Treasury_Hero_Pending_DeclarationsInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const treasury_hero_pending_declarations = /** @type {((inputs: Treasury_Hero_Pending_DeclarationsInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Treasury_Hero_Pending_DeclarationsInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_treasury_hero_pending_declarations(inputs)
	return en_treasury_hero_pending_declarations(inputs)
});