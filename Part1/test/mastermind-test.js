//[assignment] write your own unit test to show that your Mastermind variation circuit is working as expected

const path = require('path');
const chai = require('chai');

const assert = chai.assert;

const testerWasm = require('circom_tester').wasm;
const poseidonBuild = require('circomlibjs').buildPoseidon;

const f1Field = require('ffjavascript').F1Field;    // script of file returning a buffer
const scalar = require('ffjavascript').Scalar;      // script of file for passing a buffer

// return a buffer passed to fromString function
const retBuffer = new f1Field(scalar.fromString("21888242871839275222246405745257275088548364400416034343698204186575808495617"));

describe("Electronic Mastermind(Invicta) Variation test", function () {

    var buff;
    var poseidon;

    // 1. First test showing all 5 guesses are correct
    // ...............................................

    it("All 5 guesses are correct i.e. 5 hits and 0 blow", async () => {
        poseidon = await poseidonBuild();
        buff = poseidon.F;

        // the solutions are:
        const privSolnA = 2;
        const privSolnB = 4;
        const privSolnC = 6;
        const privSolnD = 8;
        const privSolnE = 0;

        // generated random int for salt
        const privSalt = Math.floor(Math.random()*10**10);

        // computing poseidon hash of the salt and solutions
        const pubSolnHash = poseidon([privSalt,privSolnA,privSolnB,privSolnC,privSolnD,privSolnE]);

        const circuit = await testerWasm("contracts/circuits/MastermindVariation.circom");
        await circuit.loadConstraints();

        // guesses made by codebreaker where eveyr guess is correct and hit is 5
        const INPUT = {
            "pubGuessA": 2,
            "pubGuessB": 4,
            "pubGuessC": 6,
            "pubGuessD": 8,
            "pubGuessE": 0,
            "pubNumHit": 5,
            "pubNumBlow": 0,
            "pubSolnHash": buff.toObject(pubSolnHash),
            "privSolnA": privSolnA,
            "privSolnB": privSolnB,
            "privSolnC": privSolnC,
            "privSolnD": privSolnD,
            "privSolnE": privSolnE,
            "privSalt" : privSalt
        }

        const witness = await circuit.calculateWitness(INPUT, true);

        assert(retBuffer.eq(retBuffer.e(witness[0]),retBuffer.e(1)));
    });

    // 2. Second test showing 4 guesses are correct but 1 guess having wrong positon i.e. 1 blow
    // .........................................................................................

    it("4 guesses are correct, but 1 wrong position(1 blow) i.e. 3 hits and 1 blow", async () => {
        poseidon = await poseidonBuild();
        buff = poseidon.F;

        // the solutions are:
        const privSolnA = 2;
        const privSolnB = 4;
        const privSolnC = 6;
        const privSolnD = 8;
        const privSolnE = 0;

        // generated random int for salt
        const privSalt = Math.floor(Math.random()*10**10);

        // computing poseidon hash of the salt and solutions
        const pubSolnHash = poseidon([privSalt,privSolnA,privSolnB,privSolnC,privSolnD,privSolnE]);

        const circuit = await testerWasm("contracts/circuits/MastermindVariation.circom");
        await circuit.loadConstraints();

        // guesses made by codebreaker where eveyr guess is correct and hit is 5
        const INPUT = {
            "pubGuessA": 2,
            "pubGuessB": 4,
            "pubGuessC": 6,
            "pubGuessD": 3,
            "pubGuessE": 8,
            "pubNumHit": 3,
            "pubNumBlow": 1,
            "pubSolnHash": buff.toObject(pubSolnHash),
            "privSolnA": privSolnA,
            "privSolnB": privSolnB,
            "privSolnC": privSolnC,
            "privSolnD": privSolnD,
            "privSolnE": privSolnE,
            "privSalt" : privSalt
        }

        const witness = await circuit.calculateWitness(INPUT, true);

        assert(retBuffer.eq(retBuffer.e(witness[0]),retBuffer.e(1)));
    });
    // 3. Third test showing 5 guesses are correct but 2 guess having wrong positon i.e. 2 blow
    // ........................................................................................

    it("5 guesses are correct, but 2 wrong position(2 blow) i.e. 3 hits and 1 blow", async () => {
        poseidon = await poseidonBuild();
        buff = poseidon.F;

        // the solutions are:
        const privSolnA = 2;
        const privSolnB = 4;
        const privSolnC = 6;
        const privSolnD = 8;
        const privSolnE = 0;

        // generated random int for salt
        const privSalt = Math.floor(Math.random()*10**10);

        // computing poseidon hash of the salt and solutions
        const pubSolnHash = poseidon([privSalt,privSolnA,privSolnB,privSolnC,privSolnD,privSolnE]);

        const circuit = await testerWasm("contracts/circuits/MastermindVariation.circom");
        await circuit.loadConstraints();

        // guesses made by codebreaker where eveyr guess is correct and hit is 5
        const INPUT = {
            "pubGuessA": 2,
            "pubGuessB": 4,
            "pubGuessC": 8,
            "pubGuessD": 6,
            "pubGuessE": 0,
            "pubNumHit": 3,
            "pubNumBlow": 2,
            "pubSolnHash": buff.toObject(pubSolnHash),
            "privSolnA": privSolnA,
            "privSolnB": privSolnB,
            "privSolnC": privSolnC,
            "privSolnD": privSolnD,
            "privSolnE": privSolnE,
            "privSalt" : privSalt
        }

        const witness = await circuit.calculateWitness(INPUT, true);

        assert(retBuffer.eq(retBuffer.e(witness[0]),retBuffer.e(1)));
    });
    // 4. All guesses are incorrect i.e. 0 hit and 0 blow
    // ..................................................

    it("All 5 guesses are incorrect i.e. 0 hit and 0 blow", async () => {
        poseidon = await poseidonBuild();
        buff = poseidon.F;

        // the solutions are:
        const privSolnA = 2;
        const privSolnB = 4;
        const privSolnC = 6;
        const privSolnD = 8;
        const privSolnE = 0;

        // generated random int for salt
        const privSalt = Math.floor(Math.random()*10**10);

        // computing poseidon hash of the salt and solutions
        const pubSolnHash = poseidon([privSalt,privSolnA,privSolnB,privSolnC,privSolnD,privSolnE]);

        const circuit = await testerWasm("contracts/circuits/MastermindVariation.circom");
        await circuit.loadConstraints();

        // guesses made by codebreaker where eveyr guess is correct and hit is 5
        const INPUT = {
            "pubGuessA": 1,
            "pubGuessB": 3,
            "pubGuessC": 5,
            "pubGuessD": 7,
            "pubGuessE": 9,
            "pubNumHit": 0,
            "pubNumBlow": 0,
            "pubSolnHash": buff.toObject(pubSolnHash),
            "privSolnA": privSolnA,
            "privSolnB": privSolnB,
            "privSolnC": privSolnC,
            "privSolnD": privSolnD,
            "privSolnE": privSolnE,
            "privSalt" : privSalt
        }

        const witness = await circuit.calculateWitness(INPUT, true);

        assert(retBuffer.eq(retBuffer.e(witness[0]),retBuffer.e(1)));
    });
});