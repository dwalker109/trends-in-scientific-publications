import { eSearch, eSummary, NcbiSummary, NcbiLookup } from "./ncbiApi";

it("Can retrieve a search result handle", async () => {
  const result = await eSearch("asthma", "1801", "1802");

  expect(result).toMatchObject<NcbiLookup>({
    count: 0,
    webEnv: expect.anything(),
    queryKey: "1"
  });
});

it("Can retrievesearch results from handle", async () => {
  const lookup: NcbiLookup = await eSearch("asthma", "1901", "1902");
  const result: NcbiSummary[] = await eSummary(lookup);

  expect(result).toMatchObject<NcbiSummary[]>([
    { uid: "21408335", date: "1902" },
    { uid: "29818320", date: "1902" }
  ]);
});
