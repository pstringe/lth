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