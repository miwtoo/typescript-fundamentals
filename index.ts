interface CurrencyResult {
    amount: number
    base: string
    date: string
    rates: {
        [a: string]: number
    }
}

class Currency<const Currencies> {
    api = 'https://api.frankfurter.app'
    constructor(public currencies: Currencies) { }

    convert(from: Currencies[keyof Currencies], to: Currencies[keyof Currencies], amount: number) {
        return fetch(`${this.api}/latest?from=${from}&to=${to}&amount=${amount}`)
            .then((x) => x.json() as any as CurrencyResult)
            .then((a) => a)
    }

    get latest() {
        return fetch(`${this.api}/latest`).then((x) => x.json())
    }

    log() {
        return this.currencies;
    }
}

const myCurrency = new Currency(['USD', 'JPY', 'THB']);
myCurrency.convert('USD', 'THB', 1).then(console.log)
myCurrency.latest.then(console.log)

// const a = ['USD', 'JPY', 'THB'] as const
// type A = typeof a
// type B<T extends keyof A> = A[T]
// type C = B<'2'>