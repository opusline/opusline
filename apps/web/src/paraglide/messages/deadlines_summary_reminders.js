/* eslint-disable */
import * as registry from '../registry.js'
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ count: NonNullable<unknown> }} Deadlines_Summary_RemindersInputs */

const en_deadlines_summary_reminders = /** @type {(inputs: Deadlines_Summary_RemindersInputs) => LocalizedString} */ (i) => {const countPlural = registry.plural("en", i?.count, {});
	if (countPlural === "one") return /** @type {LocalizedString} */ (`${i?.count} reminder to send`);
	if (countPlural === "other") return /** @type {LocalizedString} */ (`${i?.count} reminders to send`);
	return /** @type {LocalizedString} */ ("deadlines_summary_reminders");
};

const fr_deadlines_summary_reminders = /** @type {(inputs: Deadlines_Summary_RemindersInputs) => LocalizedString} */ (i) => {const countPlural = registry.plural("fr", i?.count, {});
	if (countPlural === "one") return /** @type {LocalizedString} */ (`${i?.count} relance à envoyer`);
	if (countPlural === "other") return /** @type {LocalizedString} */ (`${i?.count} relances à envoyer`);
	return /** @type {LocalizedString} */ ("deadlines_summary_reminders");
};

/**
* | countPlural | output |
* | --- | --- |
* | "one" | "{count} reminder to send" |
* | "other" | "{count} reminders to send" |
*
* @param {Deadlines_Summary_RemindersInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const deadlines_summary_reminders = /** @type {((inputs: Deadlines_Summary_RemindersInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Deadlines_Summary_RemindersInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_deadlines_summary_reminders(inputs)
	return en_deadlines_summary_reminders(inputs)
});