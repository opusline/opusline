/* eslint-disable */
import * as registry from '../registry.js'
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ count: NonNullable<unknown>, label: NonNullable<unknown>, amount: NonNullable<unknown>, day: NonNullable<unknown> }} Subscriptions_Detected_TitleInputs */

const en_subscriptions_detected_title = /** @type {(inputs: Subscriptions_Detected_TitleInputs) => LocalizedString} */ (i) => {const countPlural = registry.plural("en", i?.count, {});
	if (countPlural === "one") return /** @type {LocalizedString} */ (`Recurring debit found: ${i?.label} · ${i?.amount} · on the ${i?.day} of the month · ${i?.count} month`);
	if (countPlural === "other") return /** @type {LocalizedString} */ (`Recurring debit found: ${i?.label} · ${i?.amount} · on the ${i?.day} of the month · ${i?.count} months running`);
	return /** @type {LocalizedString} */ ("subscriptions_detected_title");
};

const fr_subscriptions_detected_title = /** @type {(inputs: Subscriptions_Detected_TitleInputs) => LocalizedString} */ (i) => {const countPlural = registry.plural("fr", i?.count, {});
	if (countPlural === "one") return /** @type {LocalizedString} */ (`Prélèvement récurrent détecté : ${i?.label} · ${i?.amount} · le ${i?.day} du mois · ${i?.count} mois`);
	if (countPlural === "other") return /** @type {LocalizedString} */ (`Prélèvement récurrent détecté : ${i?.label} · ${i?.amount} · le ${i?.day} du mois · ${i?.count} mois consécutifs`);
	return /** @type {LocalizedString} */ ("subscriptions_detected_title");
};

/**
* | countPlural | output |
* | --- | --- |
* | "one" | "Recurring debit found: {label} · {amount} · on the {day} of the month · {count} month" |
* | "other" | "Recurring debit found: {label} · {amount} · on the {day} of the month · {count} months running" |
*
* @param {Subscriptions_Detected_TitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const subscriptions_detected_title = /** @type {((inputs: Subscriptions_Detected_TitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Subscriptions_Detected_TitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_subscriptions_detected_title(inputs)
	return en_subscriptions_detected_title(inputs)
});