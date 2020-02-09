import axios from "axios";
import { DateTime } from "luxon";
import _ from "lodash";
import Bottleneck from "bottleneck";

const pageSize: number = 500;
const limiter = new Bottleneck({ minTime: 200, maxConcurrent: 10 });

const ncbiClient = axios.create({
  baseURL: "https://eutils.ncbi.nlm.nih.gov/entrez/eutils",
  method: "post",
  params: {
    api_key: "98b658d9738ecf8579fbaa1e00cb7efff609",
    db: "pubmed",
    retmode: "json",
    retmax: pageSize
  }
});

interface NcbiLookup {
  webEnv: string;
  queryKey: string;
  count: number;
}

export interface NcbiSummary {
  uid: string;
  date: string;
}

const eSearch = async (
  term: string,
  dateStart: string,
  dateEnd: string
): Promise<NcbiLookup> => {
  const {
    data: { esearchresult: result }
  }: any = await ncbiClient.request({
    url: "/esearch.fcgi",
    params: {
      term,
      datetype: "pdat",
      mindate: dateStart,
      maxDate: dateEnd,
      usehistory: "y"
    }
  });

  return {
    webEnv: result.webenv,
    queryKey: result.querykey,
    count: Number(result.count)
  };
};

const eSummary = async ({
  webEnv,
  queryKey,
  count
}: NcbiLookup): Promise<NcbiSummary[]> => {
  // Calculate each retstart (offset) and schedule a HTTP request for each part
  const retstarts = _.range(0, count, pageSize);
  const tasks = retstarts.map(retstart =>
    limiter.schedule(() =>
      ncbiClient.request({
        url: "/esummary.fcgi",
        params: { WebEnv: webEnv, query_key: queryKey, retstart }
      })
    )
  );

  // Coalesce the requests
  const results = await Promise.all(tasks);

  // Finally, pull each result batch out and prepare it for display
  const preparedResults: NcbiSummary[] = _(results)
    .compact()
    .flatMap((result: any) =>
      _(result.data.result)
        .omit("uids")
        .toArray()
        .map(it => ({
          uid: it.uid as string,
          date: it.sortpubdate
            ? DateTime.fromString(it.sortpubdate, "yyyy/mm/dd HH:mm").toFormat(
                "yyyy"
              )
            : "Unknown"
        }))
        .value()
    )
    .value();

  return preparedResults;
};

export { eSearch, eSummary };
