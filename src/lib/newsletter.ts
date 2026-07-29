export const NEWSLETTER_CONSENT_VERSION = '2026-07-29';
export const MINIMUM_SUBSCRIBER_AGE = 18;
export const MAXIMUM_SUBSCRIBER_AGE = 120;

export interface NewsletterInput {
	email?: unknown;
	birthDate?: unknown;
	consent?: unknown;
	website?: unknown;
}

export interface ValidNewsletterInput {
	email: string;
	emailNormalized: string;
	birthDate: string;
}

export type NewsletterValidation =
	| { ok: true; value: ValidNewsletterInput }
	| { ok: false; error: string };

const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const validDate = /^\d{4}-\d{2}-\d{2}$/;

export const ageOn = (birthDate: string, now = new Date()): number => {
	const [year, month, day] = birthDate.split('-').map(Number);
	let age = now.getUTCFullYear() - year;
	const beforeBirthday =
		now.getUTCMonth() + 1 < month
		|| (now.getUTCMonth() + 1 === month && now.getUTCDate() < day);
	if (beforeBirthday) age -= 1;
	return age;
};

export const isRealCalendarDate = (value: string): boolean => {
	if (!validDate.test(value)) return false;
	const [year, month, day] = value.split('-').map(Number);
	const parsed = new Date(Date.UTC(year, month - 1, day));
	return parsed.getUTCFullYear() === year
		&& parsed.getUTCMonth() === month - 1
		&& parsed.getUTCDate() === day;
};

export const validateNewsletterInput = (
	input: NewsletterInput,
	now = new Date(),
): NewsletterValidation => {
	if (typeof input.website === 'string' && input.website.trim()) {
		return { ok: false, error: 'That subscription could not be accepted.' };
	}

	const email = typeof input.email === 'string' ? input.email.trim() : '';
	if (!email || email.length > 254 || !validEmail.test(email)) {
		return { ok: false, error: 'Enter a valid email address.' };
	}

	const birthDate = typeof input.birthDate === 'string' ? input.birthDate : '';
	if (!isRealCalendarDate(birthDate)) {
		return { ok: false, error: 'Enter a real date of birth.' };
	}

	const age = ageOn(birthDate, now);
	if (age < MINIMUM_SUBSCRIBER_AGE) {
		return { ok: false, error: 'The newsletter is currently for people aged 18 or over.' };
	}
	if (age > MAXIMUM_SUBSCRIBER_AGE) {
		return { ok: false, error: 'Please check the year in your date of birth.' };
	}

	if (input.consent !== true) {
		return { ok: false, error: 'Please confirm that you want to receive the newsletter.' };
	}

	return {
		ok: true,
		value: {
			email,
			emailNormalized: email.toLocaleLowerCase('en'),
			birthDate,
		},
	};
};
