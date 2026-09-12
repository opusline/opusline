/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ suppliers: NonNullable<unknown>, amount: NonNullable<unknown> }} Subscriptions_Upcoming_Provision_NoteInputs */

const en_subscriptions_upcoming_provision_note = /** @type {(inputs: Subscriptions_Upcoming_Provision_NoteInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.suppliers} · ${i?.amount} set aside this month →`)
};

const fr_subscriptions_upcoming_provision_note = /** @type {(inputs: Subscriptions_Upcoming_Provision_NoteInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.suppliers} · ${i?.amount} provisionnés ce mois →`)
};

/**
* | output |
* | --- |
* | "{suppliers} · {amount} set aside this month →" |
*
* @param {Subscriptions_Upcoming_Provision_NoteInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const subscriptions_upcoming_provision_note = /** @type {((inputs: Subscriptions_Upcoming_Provision_NoteInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Subscriptions_Upcoming_Provision_NoteInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_subscriptions_upcoming_provision_note(inputs)
	return en_subscriptions_upcoming_provision_note(inputs)
});