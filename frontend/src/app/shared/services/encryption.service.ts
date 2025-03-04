import { inject, Injectable, PLATFORM_ID } from "@angular/core";
import { environment } from "../../../environments/environment";
import { isPlatformBrowser } from "@angular/common";

@Injectable({
    providedIn: 'root'
})
export class EncryptionService {

    private publicKey: string;
    private platformId = inject(PLATFORM_ID);

    constructor() {
        this.publicKey = environment.PUBLIC_KEY;
    }

    async encryptRSA(data: string): Promise<string> {
        const publicKey = await this.importPublicKey(this.publicKey);
        const encoder = new TextEncoder();
        const encodedData = encoder.encode(data);
    
        let encrypted: any;
        if(isPlatformBrowser(this.platformId)) {
            encrypted = await window.crypto.subtle.encrypt(
                {
                    name: "RSA-OAEP"
                },
                publicKey,
                encodedData
            );
        }
    
        return this.arrayBufferToBase64(encrypted);
    }

    private async importPublicKey(pem: string): Promise<CryptoKey> {
        const binaryDer = this.pemToArrayBuffer(pem);
        let key: any;
        if(isPlatformBrowser(this.platformId)) {
            key = await window.crypto.subtle.importKey(
                "spki",
                binaryDer,
                {
                    name: "RSA-OAEP",
                    hash: "SHA-256"
                },
                true,
                ["encrypt"]
            );
        }
        return key;
    }

    private arrayBufferToBase64(buffer: ArrayBuffer): string {
        let binary = "";
        const bytes = new Uint8Array(buffer);
        for (let i = 0; i < bytes.length; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return btoa(binary);
    }

    private pemToArrayBuffer(pem: string): ArrayBuffer {
        const base64String = pem.replace(/-----[A-Z ]+-----/g, "").replace(/\s+/g, "");
        return this.base64ToArrayBuffer(base64String);
    }

    private base64ToArrayBuffer(base64: string): ArrayBuffer {
        const binary = atob(base64);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
            bytes[i] = binary.charCodeAt(i);
        }
        return bytes.buffer;
    }
}