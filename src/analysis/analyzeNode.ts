import ts from "typescript";

import { analyzeExpression } from "./analyzeExpression";
import { analyzeStatement } from "./analyzeStatement";
import { Diagnostics } from "../classes/diagnostics";
import type { AnalysisState } from "../classes/analysisState";

export function analyzeNode(state: AnalysisState, node: ts.Node): ts.Node | ts.Statement[] {
  try {
    if (ts.isExpression(node))
      return analyzeExpression(state, node);
    else if (ts.isStatement(node))
      return analyzeStatement(state, node);
  } catch (e) {
    if (e instanceof Error && !("diagnostic" in e))
      Diagnostics.error(node, `Analysis failure occurred here\n${e.stack}`);

    throw e;
  }

  return ts.visitEachChild(node, newNode => analyzeNode(state, newNode), state.context);
}