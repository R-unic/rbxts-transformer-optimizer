import ts from "typescript";

import { transformFile } from "./transformations/transformFile";
import { TransformState, type TransformerConfig } from "./classes/transformState";
import { AnalysisState } from "./classes/analysisState";
import { analyzeFile } from "./analysis/analyzeFile";

/**
 * The transformer entry point.
 * This provides access to necessary resources and the user specified configuration.
 */
export default function (program: ts.Program, config: TransformerConfig) {
  return (transformationContext: ts.TransformationContext): ((file: ts.SourceFile) => ts.SourceFile) => {
    const analysisState = new AnalysisState(program, transformationContext, config);
    const transformState = new TransformState(program, transformationContext, config);

    return file => {
      const analyzedFile = analyzeFile(analysisState, file);
      return transformFile(transformState, analyzedFile);
    };
  };
}