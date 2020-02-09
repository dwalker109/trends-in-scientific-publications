import axios from "axios";
import { DateTime } from "luxon";
import _ from "lodash";

const pageSize: number = 500;
const maxRetStart = 1000;

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
  let summaries: NcbiSummary[] = [];

  for (
    let retstart = 0;
    retstart <= maxRetStart && retstart + pageSize < count;
    retstart += pageSize
  ) {
    const response = await ncbiClient.request({
      url: "/esummary.fcgi",
      params: { WebEnv: webEnv, query_key: queryKey, retstart }
    });

    const preparedResults: NcbiSummary[] = _(response.data.result)
      .omit("uids") // This is a list of the uuids alongside it in the data
      .map((it: any) => ({
        uid: it.uid as string,
        date: DateTime.fromString(it.sortpubdate, "yyyy/mm/dd HH:mm").toFormat(
          "yyyy"
        )
      }))
      .value();

    summaries.push(...preparedResults);
  }

  return summaries;
};

export { eSearch, eSummary };
