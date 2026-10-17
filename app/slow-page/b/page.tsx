import { sleep } from "../../sleep";

export default async function Page() {
  await sleep(800);
  return <h1>slow-page b</h1>;
}
