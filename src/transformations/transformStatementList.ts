import ts from "typescript";
import { getNodeList } from "../utility/functions";
import { transformStatement } from "./transformStatement";
import { TransformState } from "../classes/transformState";

export function transformStatementList(context: TransformState, statements: ReadonlyArray<ts.Statement>): ts.Statement[] {
  const result: ts.Statement[] = [];

  for (const statement of statements)
    result.push(...getNodeList(transformStatement(context, statement)));

  return result;
}