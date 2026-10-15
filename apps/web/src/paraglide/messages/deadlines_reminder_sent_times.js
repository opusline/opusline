/* eslint-disable */
import * as registry from '../registry.js'
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ count: NonNullable<unknown> }} Deadlines_Reminder_Sent_TimesInputs */

const en_deadlines_reminder_sent_times = /** @type {(inputs: Deadlines_Reminder_Sent_TimesInputs) => LocalizedString} */ (i) => {const countPlural = registry.plural("en", i?.count, {});
	if (countPlural === "one") return /** @type {LocalizedString} */ (`already reminded once`);
	if (countPlural === "other") return /** @type {LocalizedString} */ (`already reminded ${i?.count} times`);
	return /** @type {LocalizedString} */ ("deadlines_reminder_sent_times");
};

const fr_deadlines_reminder_sent_times = /** @type {(inputs: Deadlines_Reminder_Sent_TimesInputs) => LocalizedString} */ (i) => {const countPlural = registry.plural("fr", i?.count, {});
	if (countPlural === "one") return /** @type {LocalizedString} */ (`déjà relancée une fois`);
	if (countPlural === "other") return /** @type {LocalizedString} */ (`déjà relancée ${i?.count} fois`);
	return /** @type {LocalizedString} */ ("deadlines_reminder_sent_times");
};

/**
* | countPlural | output |
* | --- | --- |
* | "one" | "already reminded once" |
* | "other" | "already reminded {count} times" |
*
* @param {Deadlines_Reminder_Sent_TimesInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const deadlines_reminder_sent_times = /** @type {((inputs: Deadlines_Reminder_Sent_TimesInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Deadlines_Reminder_Sent_TimesInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_deadlines_reminder_sent_times(inputs)
	return en_deadlines_reminder_sent_times(inputs)
});