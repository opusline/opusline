/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Subscriptions_All_Cancelled_SubInputs */

const en_subscriptions_all_cancelled_sub = /** @type {(inputs: Subscriptions_All_Cancelled_SubInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Show the cancelled ones with the chip above, or add a new subscription.`)
};

const fr_subscriptions_all_cancelled_sub = /** @type {(inputs: Subscriptions_All_Cancelled_SubInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Affichez-les avec la puce ci-dessus, ou ajoutez un nouvel abonnement.`)
};

/**
* | output |
* | --- |
* | "Show the cancelled ones with the chip above, or add a new subscription." |
*
* @param {Subscriptions_All_Cancelled_SubInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const subscriptions_all_cancelled_sub = /** @type {((inputs?: Subscriptions_All_Cancelled_SubInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Subscriptions_All_Cancelled_SubInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_subscriptions_all_cancelled_sub(inputs)
	return en_subscriptions_all_cancelled_sub(inputs)
});