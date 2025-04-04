import ts from "typescript";

import { analyzeStatementList } from "./analyzeStatementList";
import { Diagnostics } from "../classes/diagnostics";
import type { AnalysisState } from "../classes/analysisState";
import { f } from "../utility/factory";

export function analyzeFile(state: AnalysisState, file: ts.SourceFile): ts.SourceFile {
  const statements = analyzeStatementList(state, file.statements);
  for (const diagnostic of Diagnostics.flush())
    state.context.addDiagnostic(diagnostic);

  return f.update.sourceFile(file, statements);
}