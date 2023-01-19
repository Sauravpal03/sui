// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import type {
    SignaturePubkeyPair,
    Keypair,
    SuiAddress,
    Base64DataBuffer,
} from '@mysten/sui.js';

export type AccountType = 'derived' | 'imported';

export class Account {
    #keypair: Keypair;
    public readonly type: AccountType;
    public readonly derivationPath: string | null;
    public readonly address: SuiAddress;

    constructor(
        options:
            | { type: 'derived'; derivationPath: string; keypair: Keypair }
            | { type: 'imported'; keypair: Keypair }
    ) {
        this.type = options.type;
        this.derivationPath =
            options.type === 'derived' ? options.derivationPath : null;
        this.#keypair = options.keypair;
        this.address = this.#keypair.getPublicKey().toSuiAddress();
    }

    exportKeypair() {
        return this.#keypair.export();
    }

    async sign(data: Base64DataBuffer): Promise<SignaturePubkeyPair> {
        return {
            signatureScheme: this.#keypair.getKeyScheme(),
            signature: this.#keypair.signData(data),
            pubKey: this.#keypair.getPublicKey(),
        };
    }
}