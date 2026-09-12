/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ supplier: NonNullable<unknown> }} Subscriptions_Delete_BodyInputs */

const en_subscriptions_delete_body = /** @type {(inputs: Subscriptions_Delete_BodyInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.supplier} leaves the list. The expenses already created are kept.`)
};

const fr_subscriptions_delete_body = /** @type {(inputs: Subscriptions_Delete_BodyInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.supplier} disparaît de la liste. Les dépenses déjà créées sont conservées.`)
};

/**
* | output |
* | --- |
* | "{supplier} leaves the list. The expenses already created are kept." |
*
* @param {Subscriptions_Delete_BodyInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const subscriptions_delete_body = /** @type {((inputs: Subscriptions_Delete_BodyInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Subscriptions_Delete_BodyInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_subscriptions_delete_body(inputs)
	return en_subscriptions_delete_body(inputs)
});