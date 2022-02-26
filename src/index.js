import axios from "axios";
import inquirer from "inquirer";

const GREEN = " G ";
const YELLOW = " Y ";
const BLACK = " B ";

class Wordle {
  #hints = [];
  #tries = 0;
  constructor() {
    this.wordsBank = fetchAllWords().then((res) => {
      return res;
    });
  }

  get words() {
    return this.wordsBank;
  }

  async promptUser() {
    try {
      var questions = [
        {
          type: "input",
          name: "userGuess",
          message: "Enter Guess For Today \n",
        },
      ];
      let result = await inquirer.prompt(questions);

      let found = (await this.words).find(
        (element) => element == result.userGuess.toUpperCase()
      );
      while (!found) {
        var questions = [
          {
            type: "input",
            name: "userGuess",
            message: "Word not in WordList \n Enter Another Guess For Today \n",
          },
        ];
        result = await inquirer.prompt(questions);
        found = (await this.words).find(
          (element) => element == result.userGuess.toUpperCase()
        );
      }
      return result.userGuess.toUpperCase();
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async makeHint(userGuess) {
    try {
      const hint = [];
      const secretWord = await this.#secretWord()
      console.log(userGuess, "..............")
      for (let i = 0; i < secretWord.length; ++i) {
        if (userGuess[i] == secretWord[i]) {
          hint.push(GREEN);
        } else if ([...secretWord].includes(userGuess[i])) {
          hint.push(YELLOW);
        } else {
          hint.push(BLACK);
        }
      }
      this.#hints = [...this.#hints, hint];
      return hint;
    } catch (err) {
      throw new Error(err);
    }
  }

  winMessage() {
    console.log(
      `\n\n Hey!! You just won today's wordle!! in ` +
        this.#tries +
        ` tries \n
         come back tomorrow for another!!!`
    );
  }

  loseMessage() {
    console.log(
      `\n\n Sorry (''), you couldn't find the right combination in ` +
        this.#tries +
        ` tries \n
         come back tomorrow for another!!!`
    );
  }

  win() {
    const len = this.#hints.length;
    return this.#hints.length <= 0
      ? false
      : this.#hints[len - 1].every((hint) => hint == GREEN);
  }

  async play() {
    while (this.#tries < 6 && !this.win()) {
      const userGuess = await this.promptUser();
      const hint = await this.makeHint(userGuess);
      this.#tries += 1;

      console.log(hint + "\n");
    }
    this.win() ? this.winMessage() : this.loseMessage();
  }

  async #secretWord() {
    let date = new Date();
    let w = await this.words;
    const secreteInd =
      date.getDate() > w.length
        ? date.getDate() % w.length
        : w.length % date.getDate();
        
    return w[secreteInd];
  }
}

const fetchAllWords = async () => {
  const words = await axios.get("http://localhost:3000/words");
  return words.data;
};

export { fetchAllWords, Wordle, NaiveWordleSolver };

const wordle = new Wordle();
wordle.play();

class NaiveWordleSolver extends Wordle {
  #wordSpace;
  #count;
  #wrongPositionedWordMap = new Map();
  constructor() {
    super();
    this.#wordSpace = this.words.then((res) => res);
  }

  async solve() {
    const userGuess = await this.promptUser();
    const hint = await this.makeHint(userGuess);

    this.#wordSpace = Promise.resolve(
        (await this.#wordSpace).filter(word => {
            return this.isPossibleWord(hint, word, userGuess)
        })
    )
  }

  async isPossibleWord(hint, word, userGuess) {
    return [...userGuess].every((guess, ind) => {
        const inMap = this.#wrongPositionedWordMap.has(guess) && this.#wrongPositionedWordMap[guess] == ind ? true : false
        if (inMap) {
            return true
        }

        if (guess == word[ind]) {
            if (hint[ind] == ' G ') {
                return true
            } else if(hint[ind] == ' B ') {
                return false
            } else {
                this.#wrongPositionedWordMap.set(word[ind], ind)
                return false
            }
        } else {
            if (hint[ind] == ' G ') {
                return false
            } else if(hint[ind] == ' B ') {
                return true
            } else {
                this.#wrongPositionedWordMap.set(word[ind], ind)
                return true
            }
        }
    })
  }

  
}
