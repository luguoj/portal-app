export function useFileReader(handler: (result: string | ArrayBuffer | null) => void) {
    const reader = new FileReader();
    reader.addEventListener("load", function (e: ProgressEvent<FileReader>) {
        if (e.target) {
            try {
                handler(e.target.result)
            } catch (err) {
                console.log(err)
            }
        }
    }, false);
    return {
        readAsText(blob: Blob, encoding?: string) {
            reader.readAsText(blob, encoding)
        },
        readAsArrayBuffer(blob: Blob) {
            reader.readAsArrayBuffer(blob)
        }
    }
}