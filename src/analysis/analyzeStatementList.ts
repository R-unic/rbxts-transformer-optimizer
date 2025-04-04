import ts from "typescript";

import { getNodeList } from "../utility/functions";
import { analyzeStatement } from "./analyzeStatement";
import { AnalysisState } from "../classes/analysisState";

export function analyzeStatementList(state: AnalysisState, statements: ReadonlyArray<ts.Statement>): ts.Statement[] {
  const result: ts.Statement[] = [];

  for (const statement of statements)
    result.push(...getNodeList(analyzeStatement(state, statement)));

  return result;
}