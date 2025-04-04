import ts, { Expression } from "typescript";

import { f } from "../../utility/factory";
import { transformExpression } from "../transformExpression";
import type { TransformState } from "../../classes/transformState";

export function transformParenthesizedExpression(state: TransformState, node: ts.ParenthesizedExpression): ts.Expression {
  const expression = transformExpression(state, node.expression);
  return f.is.unwrappable(expression)
    ? expression
    : state.transformChildren(node);
}