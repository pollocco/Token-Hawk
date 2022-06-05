/**
 * Sleeps for specified amount of milliseconds.
 * 
 * @param {number} ms
 */
export async function sleep ( ms: number ) {
    return new Promise( resolve => setTimeout( resolve, ms ) );
}

export function getTimestamp() {
    return Math.floor( Date.now() / 1000 );
}
