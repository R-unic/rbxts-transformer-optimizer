import ts from "typescript";

import { f } from "../utility/factory";
import { transformStatementList } from "./transformStatementList";
import { Diagnostics } from "../classes/diagnostics";
import type { TransformState } from "../classes/transformState";

export function transformFile(state: TransformState, file: ts.SourceFile): ts.SourceFile {
  const statements = transformStatementList(state, file.statements);
  for (const diagnostic of Diagnostics.flush())
    state.context.addDiagnostic(diagnostic);

  return f.update.sourceFile(file, statements);
}