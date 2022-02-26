import { fetchAllWords, Wordle } from '../src/index'
test("TEST FETCH_ALL_5_LETTER_WORDS WHICH IS ALWAYS MORE THAN 10000 IN LENGTH", async () => {
    const words = await fetchAllWords();
    const len = words.length
    expect(len).toBeGreaterThan(10000);
})
