import { Converter } from "./currency";

const a = new Converter(["USD", "THB", "JPY"]);
a.convert("USD", "THB", 2).then(console.log);