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
	// @ts-ignore
	return async function a(this, from: string, to: string, amount: number) {
		const key = `${from}${to}`;
		if (this.caches[key]) return this.caches[key] * amount;

		console.log("First time");

		const result = await method.bind(this)(from, to, amount);

		const rate = result.rates[to];
		this.caches[key] = rate / result.amount;

		return rate;
	};
}

class Currency<
	const Currencies extends readonly string[],
	Values extends string = Extract<Currencies[keyof Currencies], string>,
> {
	api = "https://api.frankfurter.app";
	private caches: Record<string, number> = {};
	constructor(public currencies: Currencies) {}

	@cache
	async convert<To extends Values>(from: Values, to: To, amount: number) {
		return await fetch(
			`${this.api}/latest?from=${from}&to=${to}&amount=${amount}`,
		)
			.then((x) => x.json() as unknown as CurrencyResult<To>)
			.then((a) => a);
	}

	get latest() {
		return fetch(`${this.api}/latest`).then((x) => x.json());
	}

	log() {
		return this.currencies;
	}
}

class MyCurrency<
	const Currencies extends readonly string[],
	Values extends string = Extract<Currencies[keyof Currencies], string>,
> extends Currency<Currencies, Values> {
	constructor(
		public currencies: Currencies,
		public api = "https://api.frankfurter.app",
	) {
		super(currencies);
	}
}

const myCurrency = new MyCurrency(["USD", "JPY", "THB"]);

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
