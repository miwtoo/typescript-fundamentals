interface CurrencyResult<T extends string> {
	amount: number;
	base: string;
	date: string;
	rates: Record<T, number>;
}

// const caches = {
//     'USDTHB': 35
// }

function cache(method: Function, context: unknown) {
	return function a(from: string, to: string, amount: number) {
		method(from, to, amount);
	};
}

class Currency<
	const Currencies extends readonly string[],
	Values extends string = Extract<Currencies[keyof Currencies], string>,
> {
	api = "https://api.frankfurter.app";
	private caches: Record<string, number> = {};
	constructor(public currencies: Currencies) {}

	// @cache
	async convert<To extends Values>(
		from: Currencies[keyof Currencies],
		to: To,
		amount: number,
	) {
		const key = `${from}${to}`;

		if (this.caches[key]) {
			return this.caches[key] * amount;
		}

		const result = await fetch(
			`${this.api}/latest?from=${from}&to=${to}&amount=${amount}`,
		)
			.then((x) => x.json() as unknown as CurrencyResult<To>)
			.then((a) => a);

		const rate = result.rates[to as To];
		this.caches[key] = rate / result.amount;

		return rate;
	}

	get latest() {
		return fetch(`${this.api}/latest`).then((x) => x.json());
	}

	log() {
		return this.currencies;
	}
}

const myCurrency = new Currency(["USD", "JPY", "THB"]);

const a = async () => {
	await myCurrency.convert("USD", "THB", 1).then(console.log);
	await myCurrency.convert("USD", "THB", 2).then(console.log);
	await myCurrency.convert("USD", "THB", 3).then(console.log);
	await myCurrency.convert("JPY", "THB", 2).then(console.log);
};

a();

// myCurrency.latest.then(console.log);

// const a = ['USD', 'JPY', 'THB'] as const
// type A = typeof a
// type B<T extends keyof A> = A[T]
// type C = B<'2'>
