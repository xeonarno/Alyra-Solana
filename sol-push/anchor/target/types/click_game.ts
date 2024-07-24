/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/click_game.json`.
 */
export type ClickGame = {
  "address": "CBqAoNz1odmFdvUj7i2hcmdx1HcDfPrwNynUAaj19PZJ",
  "metadata": {
    "name": "clickGame",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "checkWinner",
      "discriminator": [
        246,
        195,
        208,
        54,
        162,
        217,
        84,
        64
      ],
      "accounts": [
        {
          "name": "game",
          "writable": true
        },
        {
          "name": "lastPlayer",
          "writable": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "click",
      "discriminator": [
        11,
        147,
        179,
        178,
        145,
        118,
        45,
        186
      ],
      "accounts": [
        {
          "name": "game",
          "writable": true
        },
        {
          "name": "player",
          "writable": true,
          "signer": true
        },
        {
          "name": "lastPlayer",
          "writable": true
        },
        {
          "name": "contractWallet",
          "writable": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "getGameInfo",
      "discriminator": [
        140,
        141,
        245,
        71,
        227,
        131,
        217,
        93
      ],
      "accounts": [
        {
          "name": "game"
        }
      ],
      "args": [],
      "returns": {
        "defined": {
          "name": "gameInfo"
        }
      }
    },
    {
      "name": "initializeGame",
      "discriminator": [
        44,
        62,
        102,
        247,
        126,
        208,
        130,
        215
      ],
      "accounts": [
        {
          "name": "game",
          "writable": true,
          "signer": true
        },
        {
          "name": "initializer",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "owner",
          "type": "pubkey"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "game",
      "discriminator": [
        27,
        90,
        166,
        125,
        74,
        100,
        121,
        18
      ]
    }
  ],
  "types": [
    {
      "name": "game",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "totalLamports",
            "type": "u64"
          },
          {
            "name": "lastPlayer",
            "type": "pubkey"
          },
          {
            "name": "lastClickTimestamp",
            "type": "i64"
          },
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "winners",
            "type": {
              "array": [
                {
                  "option": {
                    "defined": {
                      "name": "winner"
                    }
                  }
                },
                10
              ]
            }
          },
          {
            "name": "winnerIndex",
            "type": "u8"
          },
          {
            "name": "winnerCount",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "gameInfo",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "totalLamports",
            "type": "u64"
          },
          {
            "name": "remainingTime",
            "type": "i64"
          },
          {
            "name": "winners",
            "type": {
              "vec": {
                "defined": {
                  "name": "winner"
                }
              }
            }
          }
        ]
      }
    },
    {
      "name": "winner",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "player",
            "type": "pubkey"
          },
          {
            "name": "timestamp",
            "type": "i64"
          },
          {
            "name": "amount",
            "type": "u64"
          }
        ]
      }
    }
  ]
};
