declare module 'dom-to-image' {
    const domtoimage: {
      toPng(node: HTMLElement, options?: any): Promise<string>;
      toJpeg(node: HTMLElement, options?: any): Promise<string>;
      toBlob(node: HTMLElement, options?: any): Promise<Blob>;
      toSvg(node: HTMLElement, options?: any): Promise<string>;
    };
    export default domtoimage;
  }