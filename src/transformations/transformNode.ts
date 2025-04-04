import ts from "typescript";

import { transformExpression } from "./transformExpression";
import { transformStatement } from "./transformStatement";
import { Diagnostics } from "../classes/diagnostics";
import type { TransformState } from "../classes/transformState";

export function transformNode(state: TransformState, node: ts.Node): ts.Node | ts.Statement[] | undefined {
  try {
    if (ts.isExpression(node))
      return transformExpression(state, node);
    else if (ts.isStatement(node))
      return transformStatement(state, node);
  } catch (e) {
    if (e instanceof Error && !("diagnostic" in e))
      Diagnostics.error(node, `Optimization failure occurred here\n${e.stack}`);

    throw e;
  }

  return ts.visitEachChild(node, newNode => transformNode(state, newNode), state.context);
}