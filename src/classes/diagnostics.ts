import ts from "typescript";

function createDiagnosticAtLocation(
  node: ts.Node,
  messageText: string,
  category: ts.DiagnosticCategory,
  file = ts.getSourceFileOfNode(node),
  code = 0
): ts.DiagnosticWithLocation {
  return {
    category,
    file,
    messageText,
    start: node.getStart(),
    length: node.getWidth(),
    code
  };
}

export class DiagnosticError extends Error {
  constructor(public readonly diagnostic: ts.DiagnosticWithLocation) {
    super(diagnostic.messageText as string);
  }
}

export class Diagnostics {
  public static diagnostics: ts.DiagnosticWithLocation[] = [];

  public static addDiagnostic(diag: ts.DiagnosticWithLocation): void {
    this.diagnostics.push(diag);
  }

  public static createDiagnostic(node: ts.Node, category: ts.DiagnosticCategory, ...messages: string[]): ts.DiagnosticWithLocation {
    return createDiagnosticAtLocation(node, messages.join("\n"), category);
  }

  public static relocate(diagnostic: ts.DiagnosticWithLocation, node: ts.Node): never {
    diagnostic.file = ts.getSourceFileOfNode(node);
    diagnostic.start = node.getStart();
    diagnostic.length = node.getWidth();
    throw new DiagnosticError(diagnostic);
  }

  public static error(node: ts.Node, ...messages: string[]): never {
    throw new DiagnosticError(this.createDiagnostic(node, ts.DiagnosticCategory.Error, ...messages));
  }

  public static warning(node: ts.Node, ...messages: string[]): void {
    this.addDiagnostic(this.createDiagnostic(node, ts.DiagnosticCategory.Warning, ...messages));
  }

  public static flush(): ts.DiagnosticWithLocation[] {
    const diagnostics = this.diagnostics;
    this.diagnostics = [];

    return diagnostics;
  }
}