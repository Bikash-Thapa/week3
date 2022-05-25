pragma circom 2.0.0;

// [assignment] implement a variation of mastermind from https://en.wikipedia.org/wiki/Mastermind_(board_game)#Variation as a circuit
// Here, the mastermind variation used is Electronic Mastermind also called as Invicta.
// The variation of the mastermind is implemented by taking the reference from eno-kuro's zku-final-project repository hitandblow.circom
// Invicta uses 10 digits (from 0 to 9) as alias of colors and can use 3, 4, or 5 holes(which are number of guesses made in hitandblow.circom)
// The below code is implemented by taking the copy of hitandblow.circom (https://github.com/enu-kuro/zku-final-project/blob/main/circuits/hitandblow.circom)
// It is then modified to take 5 input signals for the guess instead of 4.

// Circom code imported from circomlib library
include "../../node_modules/circomlib/circuits/comparators.circom";
include "../../node_modules/circomlib/circuits/bitify.circom";
include "../../node_modules/circomlib/circuits/poseidon.circom";

template MastermindVariation() {

    // Five Public inputs
    signal input pubGuessA;
    signal input pubGuessB;
    signal input pubGuessC;
    signal input pubGuessD;
    signal input pubGuessE;
    signal input pubNumHit;
    signal input pubNumBlow;
    signal input pubSolnHash;

    // Five Private inputs
    signal input privSolnA;
    signal input privSolnB;
    signal input privSolnC;
    signal input privSolnD;
    signal input privSolnE;
    signal input privSalt; // input signal that prevents from brute-force attacks

    // Output of hash of solution made by codemaker along with additional privSalt
    signal output solnHashOut;

    var guess[5] = [pubGuessA, pubGuessB, pubGuessC, pubGuessD, pubGuessE];
    var soln[5] =  [privSolnA, privSolnB, privSolnC, privSolnD, privSolnE];
    var j = 0;
    var k = 0;
    component lessThan[10];     // 10 components declared for ensuring that 5 guesses and 5 solutions are less than 10
    component equalGuess[10];   // 10 components declared for ensuring that all the guess solutions are unique
    component equalSoln[10];    // 10 components declared for ensuring that all the exact corrrect solutions are unique
    var equalIdx = 0;

    // Create a constraint that the solution and guess digits are all less than 10.
    for (j=0; j<5; j++) {
        lessThan[j] = LessThan(4);
        lessThan[j].in[0] <== guess[j];
        lessThan[j].in[1] <== 10;
        lessThan[j].out === 1;
        lessThan[j+5] = LessThan(4);
        lessThan[j+5].in[0] <== soln[j];
        lessThan[j+5].in[1] <== 10;
        lessThan[j+5].out === 1;
        for (k=j+1; k<5; k++) {
            // Create a constraint that the solution and guess digits are unique. no duplication.
            equalGuess[equalIdx] = IsEqual();
            equalGuess[equalIdx].in[0] <== guess[j];
            equalGuess[equalIdx].in[1] <== guess[k];
            equalGuess[equalIdx].out === 0;
            equalSoln[equalIdx] = IsEqual();
            equalSoln[equalIdx].in[0] <== soln[j];
            equalSoln[equalIdx].in[1] <== soln[k];
            equalSoln[equalIdx].out === 0;
            equalIdx += 1;
        }
    }

    // Count hit & blow
    var hit = 0;
    var blow = 0;
    component equalHB[25];

    for (j=0; j<5; j++) {
        for (k=0; k<5; k++) {
            equalHB[5*j+k] = IsEqual();
            equalHB[5*j+k].in[0] <== soln[j];
            equalHB[5*j+k].in[1] <== guess[k];
            blow += equalHB[5*j+k].out;
            if (j == k) {
                hit += equalHB[5*j+k].out;
                blow -= equalHB[5*j+k].out;
            }
        }
    }

    // Create a constraint around the number of hit
    component equalHit = IsEqual();
    equalHit.in[0] <== pubNumHit;
    equalHit.in[1] <== hit;
    equalHit.out === 1;
    
    // Create a constraint around the number of blow
    component equalBlow = IsEqual();
    equalBlow.in[0] <== pubNumBlow;
    equalBlow.in[1] <== blow;
    equalBlow.out === 1;

    // Verify that the hash of the private solution matches pubSolnHash
    component poseidon = Poseidon(6);
    poseidon.inputs[0] <== privSalt;
    poseidon.inputs[1] <== privSolnA;
    poseidon.inputs[2] <== privSolnB;
    poseidon.inputs[3] <== privSolnC;
    poseidon.inputs[4] <== privSolnD;
    poseidon.inputs[5] <== privSolnE;

    solnHashOut <== poseidon.out;
    pubSolnHash === solnHashOut;
 }

// variables inside public ensuring that those variables used in MastermindVariation() are public in nature
component main {public [pubGuessA, pubGuessB, pubGuessC, pubGuessD, pubGuessE, pubNumHit, pubNumBlow, pubSolnHash]} = MastermindVariation();