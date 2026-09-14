/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Subscriptions_Auto_Create_NoteInputs */

const en_subscriptions_auto_create_note = /** @type {(inputs: Subscriptions_Auto_Create_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Expenses already created are not changed when you change the option or the amount.`)
};

const fr_subscriptions_auto_create_note = /** @type {(inputs: Subscriptions_Auto_Create_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Les dépenses déjà créées ne sont pas modifiées quand vous changez l'option ou le montant.`)
};

/**
* | output |
* | --- |
* | "Expenses already created are not changed when you change the option or the amount." |
*
* @param {Subscriptions_Auto_Create_NoteInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const subscriptions_auto_create_note = /** @type {((inputs?: Subscriptions_Auto_Create_NoteInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Subscriptions_Auto_Create_NoteInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_subscriptions_auto_create_note(inputs)
	return en_subscriptions_auto_create_note(inputs)
});