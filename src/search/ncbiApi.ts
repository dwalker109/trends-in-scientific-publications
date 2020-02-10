import axios from "axios";
import { DateTime } from "luxon";
import _ from "lodash";
import Bottleneck from "bottleneck";
import config from "../config";

// Some setup - much faster if an NCBI api key is set in config
const { apiKey } = config;
const pageSize: number = 500;
const limiter = new Bottleneck({
  minTime: apiKey ? 200 : 500,
  maxConcurrent: apiKey ? 10 : 3
});

// Create client for reuse, with API key if available
const ncbiClient = axios.create({
  baseURL: "https://eutils.ncbi.nlm.nih.gov/entrez/eutils",
  method: "post",
  params: {
    ...(apiKey ? { api_key: "98b658d9738ecf8579fbaa1e00cb7efff609" } : {}),
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

/**
 * Create a search and stores results - returns a handle to retrieve later
 */
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

/**
 * Retrieve a set of results (parallelised) from a search handle
 */
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
