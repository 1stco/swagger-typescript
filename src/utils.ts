import { Schema, Parameter } from "./types";

function getPathParams(parameters?: Parameter[]): Parameter[] {
  return (
    parameters?.filter(({ in: In }) => {
      return In === "path";
    }) || []
  );
}

function getQueryParams(parameters?: Parameter[]) {
  const queryParamsArray =
    parameters?.filter(({ in: In }) => {
      return In === "query";
    }) || [];
  let queryParams = queryParamsArray.reduce((prev, { name, schema }) => {
    return `${prev}${name}${schema.nullable ? "?" : ""}: ${getTsType(schema)},`;
  }, "{");

  const hasQueryParams = queryParams && queryParams.length > 1;
  queryParams = hasQueryParams ? queryParams + "}" : "";

  return {
    queryParams,
    hasNullable: queryParamsArray.find(({ schema }) => schema.nullable),
  };
}

function generateServiceName(endPoint: string): string {
  function replaceWithUpper(str: string, sp: string) {
    let pointArray = str.split(sp);
    pointArray = pointArray.map(
      (point) => `${point.substring(0, 1).toUpperCase()}${point.substring(1)}`,
    );

    return pointArray.join("");
  }

  let name = replaceWithUpper(
    replaceWithUpper(replaceWithUpper(endPoint, "/"), "{"),
    "}",
  );

  return name;
}

const TYPES = {
  integer: "number",
  number: "number",
  boolean: "boolean",
  object: "object",
  string: "string",
  array: "array",
};

function getTsType({
  type,
  $ref,
  enum: Enum,
  items,
  properties,
}: Schema): string {
  let tsType = TYPES[type as keyof typeof TYPES];

  if ($ref) {
    tsType = getRefName($ref);
  }
  if (Enum) {
    tsType = JSON.stringify(Enum);
  }

  if (items) {
    tsType = `${getTsType(items)}[]`;
  }

  if (properties) {
    tsType = Object.entries(properties)
      .map(([pName, value]) => ({ ...(value as any), name: pName }))
      .reduce((prev, schema: Schema & { name: string }) => {
        return `${prev}${schema.name}${schema.nullable ? "?" : ""}: ${getTsType(
          schema,
        )},`;
      }, "{");

    tsType = tsType ? tsType + "}" : "";
  }

  // if (nullable) {
  //   tsType + "| null";
  // }

  return tsType;
}

function getRefName($ref: string): string {
  return $ref.replace("#/components/schemas/", "");
}

export {
  getPathParams,
  getQueryParams,
  generateServiceName,
  getTsType,
  getRefName,
};
