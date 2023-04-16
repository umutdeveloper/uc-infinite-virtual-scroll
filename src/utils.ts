export function generateParagraph(numBlanks: number = 0): string {
  const MIN_CHARACTERS = 50;
  const MAX_CHARACTERS = 1000;
  const CHARACTERS =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 ';
  const BLANK_CHARACTER = ' ';

  let paragraph = '';
  const paragraphLength =
    Math.floor(Math.random() * (MAX_CHARACTERS - MIN_CHARACTERS + 1)) +
    MIN_CHARACTERS;

  for (let i = 0; i < paragraphLength; i++) {
    const char = CHARACTERS.charAt(
      Math.floor(Math.random() * CHARACTERS.length)
    );
    paragraph += char;

    if (char === BLANK_CHARACTER && numBlanks > 0) {
      paragraph += BLANK_CHARACTER.repeat(numBlanks);
      numBlanks = 0;
    }
  }

  return paragraph;
}
