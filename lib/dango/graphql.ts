"use client";

const DANGO_API = "https://api-mainnet.dango.zone";

function toSnake(s: string): string {
  return s.replace(/[A-Z]/g, (l) => "_" + l.toLowerCase());
}
function snakeKeys(o: any): any {
  if (Array.isArray(o)) return o.map(snakeKeys);
  if (o && typeof o === "object")
    return Object.fromEntries(Object.entries(o).map(([k, v]) => [toSnake(k), snakeKeys(v)]));
  return o;
}
function toCamel(s: string): string {
  return s.replace(/_([a-z])/g, (_, l) => l.toUpperCase());
}
function camelKeys(o: any): any {
  if (Array.isArray(o)) return o.map(camelKeys);
  if (o && typeof o === "object")
    return Object.fromEntries(Object.entries(o).map(([k, v]) => [toCamel(k), camelKeys(v)]));
  return o;
}

export async function gql(document: string, variables?: Record<string, any>) {
  const res = await fetch(DANGO_API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query: document, variables }),
  });
  if (!res.ok) throw new Error("GraphQL HTTP error: " + res.status);
  const json = await res.json();
  if (json.errors) throw new Error(JSON.stringify(json.errors));
  return json.data;
}

export async function queryApp(query: Record<string, any>, height?: number) {
  const document = `
    query queryResult($request: String!, $height: Int) {
      queryApp(request: $request, height: $height)
    }
  `;
  const data = await gql(document, {
    request: JSON.stringify(snakeKeys(query)),
    height: height || undefined,
  });
  if (!data?.queryApp) return null;
  return camelKeys(JSON.parse(data.queryApp));
}

let _appConfig: any = null;
export async function getAppConfig() {
  if (_appConfig) return _appConfig;
  const res = await queryApp({ appConfig: {} });
  _appConfig = res?.appConfig ?? res;
  return _appConfig;
}