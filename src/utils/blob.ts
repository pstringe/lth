/*
** Utility function for converting UUID to Blob type for more efficient storage
*/

export const uuidToBlob = (uuid: string) => {
    const hex = uuid?.replace(/-/g, '');
    const match = hex?.match(/.{1,2}/g);
    if (!uuid || !match || match.length !== 16 || !hex) {
        throw new Error('Invalid UUID');
    }
    const bytes = new Uint8Array(match.map(byte => parseInt(byte, 16)));
    return bytes;
}

export const blobToUuid = (blob: Uint8Array) => {
    const hex = Array.from(blob, byte => {
        return ('0' + (byte & 0xff).toString(16)).slice(-2);
    }).join('');
    const uuid = `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
    return uuid;
}