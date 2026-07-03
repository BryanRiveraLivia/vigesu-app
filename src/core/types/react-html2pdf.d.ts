declare module "html2pdf.js" {
  const html2pdf: (element?: HTMLElement | string) => {
    from: (element: HTMLElement | string) => unknown;
    set: (opt: object) => unknown;
    outputPdf: () => Promise<Blob>;
    save: (filename?: string) => Promise<void>;
    [key: string]: unknown;
  };
  export default html2pdf;
}
