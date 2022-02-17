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

class Wordle {
    constructor() {
    this.wordsBank = fetchAllWords().then(res => {
        return res
    })
  }

   get words() {
      return this.wordsBank
    }

    async guess() {
        let w =  await this.words
        return w
    }
}

const fetchAllWords = async () => {
    const words = await axios.get("http://localhost:3000/words");
    return words.data
};

const wordle = new Wordle();
wordle.guess()