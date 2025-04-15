
import { inject, Injectable, PLATFORM_ID } from "@angular/core";
import { environment } from "../../../environments/environment";
import { isPlatformBrowser } from "@angular/common";

@Injectable({
    providedIn: 'root'
})
export class EncryptionService {

    private publicKey: string;
    private ivPosition: number;
    private passPhrase: string;
    private platformId = inject(PLATFORM_ID);

    constructor() {
        this.publicKey = environment.PUBLIC_KEY;
        this.ivPosition = environment.IV_POSITION;
        this.passPhrase = environment.AES_PASSPHRASE;
    }

    // RSA
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

    // AES
    async encryptAES(data: string): Promise<string> {        
        // part 1: create symmetric key, iv & salt
        const salt = this.generateRandomHex(32);
        const key = await this.deriveKey(this.passPhrase, salt);

        const encoder = new TextEncoder();
        const encodedData = encoder.encode(data);

        let iv: any;
        let encryptedBuffer: any;
        if(isPlatformBrowser(this.platformId)) {
            iv = window.crypto.getRandomValues(new Uint8Array(16));
            encryptedBuffer = await window.crypto.subtle.encrypt(
                {name: "AES-CBC", iv},
                key,
                encodedData
            );
        }
        
        // part 2: encryption & hide key elements as hex
        const ivHex = this.convertUint8ArrayToHex(iv);
        const encryptedHex = this.convertUint8ArrayToHex(new Uint8Array(encryptedBuffer));

        const salt1 = salt.slice(0, this.ivPosition);
        const salt2 = salt.slice(this.ivPosition);

        return `${salt1}${ivHex}${salt2}${encryptedHex}`;
    }

    private generateRandomHex(size: number): string {
        const bytes = new Uint8Array(size);
        if(isPlatformBrowser(this.platformId)) { 
            window.crypto.getRandomValues(bytes);
        }
        return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
    }

    private convertUint8ArrayToHex(bytes: Uint8Array): string {
        return Array.from(bytes)
            .map((b) => b.toString(16).padStart(2, "0"))
            .join("");
    }

    private async deriveKey(passphrase: string, salt: string): Promise<CryptoKey> {
        const encoder = new TextEncoder();
        let keyMaterial: any;
        let key: any;
        if(isPlatformBrowser(this.platformId)) {
            keyMaterial = await window.crypto.subtle.importKey(
                "raw",
                encoder.encode(passphrase),
                { name: "PBKDF2" },
                false,
                ["deriveBits", "deriveKey"]
            );

            key = await window.crypto.subtle.deriveKey(
                {
                    name: "PBKDF2",
                    salt: encoder.encode(salt),
                    iterations: 100000,
                    hash: "SHA-256",
                },
                keyMaterial,
                { name: "AES-CBC", length: 256 },
                false, // true only for debugging
                ["encrypt", "decrypt"]
            );
        }
        return key;
    }
}