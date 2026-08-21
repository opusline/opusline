/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ date: NonNullable<unknown> }} Treasury_Dialog_HintInputs */

const en_treasury_dialog_hint = /** @type {(inputs: Treasury_Dialog_HintInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`The known balance covers up to ${i?.date} — a transfer dated after that is deducted straight away, an earlier one is already counted.`)
};

const fr_treasury_dialog_hint = /** @type {(inputs: Treasury_Dialog_HintInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Le solde connu couvre jusqu'au ${i?.date} — un virement postérieur est déduit tout de suite, un virement antérieur est déjà compté.`)
};

/**
* | output |
* | --- |
* | "The known balance covers up to {date} — a transfer dated after that is deducted straight away, an earlier one is already counted." |
*
* @param {Treasury_Dialog_HintInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const treasury_dialog_hint = /** @type {((inputs: Treasury_Dialog_HintInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Treasury_Dialog_HintInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_treasury_dialog_hint(inputs)
	return en_treasury_dialog_hint(inputs)
});