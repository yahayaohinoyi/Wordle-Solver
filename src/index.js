// secret = Water
// guess = Bread

// Water
// Bread

// {a, e, r} -> present-category ()
// {W, t} -> not present (colour -> black)
// {a, e, r} -> wrongly placed (colour -> yellow) else (color -> green)

//Program to solve wordle
// guess() -> [pool of 5 lettered strring I have from my dataset]

// score-every-single --> work in my bank and rank them;

//6 tries

// some letters occur more frequently than others
// compare letters in the alphabets and rank them based on the probability of occurence
//
import axios from "axios";
import inquirer from 'inquirer'

const GREEN = ' G '
const YELLOW = ' Y '
const BLACK = ' B '

class Wordle {
    #hints = []
    #tries = 0
    constructor() {
    this.wordsBank = fetchAllWords().then(res => {
        return res
    })
  }

    get words() {
      return this.wordsBank
    }

    async promptUser() {
        try {
            var questions = [
                {
                  type: 'input',
                  name: 'userGuess',
                  message: "Enter Guess For Today \n"
                }
              ]
            let result = await inquirer.prompt(questions);
            
            const found = (await this.words).find(element => element == result.userGuess.toUpperCase());
            while (!found) {
                var questions = [
                    {
                      type: 'input',
                      name: 'userGuess',
                      message: "Word not in WordList \n Enter Another Guess For Today \n"
                    }
                  ]
                  result = await inquirer.prompt(questions);
            }
            return result.userGuess.toUpperCase()
        } catch (err) {
            throw new Error (err.message)
        }

    }

    async makeHint(userGuess, secretWord) {
        try {
            const hint = []
            console.log(userGuess, secretWord)
            for (let i = 0; i < secretWord.length; ++i)
            {
                if (userGuess[i] == secretWord[i]) {
                    hint.push(GREEN)
                } else if ([...secretWord].includes(userGuess[i])) {
                    hint.push(YELLOW)
                } else {
                    hint.push(BLACK)
                }
            }
            this.#hints = [...this.#hints, hint]
            return hint
        } catch (err) {
            throw new Error(err)
        }
    
    }

    winMessage() {
        console.log(`\n\n Hey!! You just won today's wordle!! in ` + this.#tries + ` tries \n
         come back tomorrow for another!!!`)
    }

    loseMessage() {
        console.log(`\n\n Sorry (''), you couldn't find the right combination in ` + this.#tries + ` tries \n
         come back tomorrow for another!!!`)
    }

    win() {
        const len = this.#hints.length
        return this.#hints.length <= 0 ? false : this.#hints[len - 1].every(hint => hint == GREEN)
    }

    async play() {
        const secretWord = await this.secretWord()
        while (this.#tries < 6 && !(this.win())) {
            const userGuess = await this.promptUser()
            const hint = await this.makeHint(userGuess, secretWord)
            this.#tries += 1

            console.log(hint + '\n')
        } 
        (this.win()) ? this.winMessage() : this.loseMessage()
    }

    async secretWord() {
        let date = new Date();
        let w =  await this.words
        const secreteInd = date.getDay() > w.length ? date.getDay() % w.length : w.length % date.getDay();
        return w[secreteInd]
    }
}

const fetchAllWords = async () => {
    const words = await axios.get("http://localhost:3000/words");
    return words.data
};
 
export { fetchAllWords, Wordle };

const wordle = new Wordle()
wordle.play()