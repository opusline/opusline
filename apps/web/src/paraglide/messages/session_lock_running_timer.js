/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Session_Lock_Running_TimerInputs */

const en_session_lock_running_timer = /** @type {(inputs: Session_Lock_Running_TimerInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Timer running`)
};

const fr_session_lock_running_timer = /** @type {(inputs: Session_Lock_Running_TimerInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Suivi en cours`)
};

/**
* | output |
* | --- |
* | "Timer running" |
*
* @param {Session_Lock_Running_TimerInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const session_lock_running_timer = /** @type {((inputs?: Session_Lock_Running_TimerInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Session_Lock_Running_TimerInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_session_lock_running_timer(inputs)
	return en_session_lock_running_timer(inputs)
});