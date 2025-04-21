import numpy as np
from nltk.stem.porter import PorterStemmer
from nltk.tokenize import wordpunct_tokenize

stemmer = PorterStemmer()

def tokenize(sentence):
    """
    Tokenize sentence into words (no punkt required)
    """
    return wordpunct_tokenize(sentence)

def stem(word):
    """
    Find root form of the word
    """
    return stemmer.stem(word.lower())

def bag_of_words(tokenized_sentence, words):
    """
    Return bag of words array:
    1 for each known word that exists in the sentence, 0 otherwise
    """
    sentence_words = [stem(word) for word in tokenized_sentence]
    bag = np.zeros(len(words), dtype=np.float32)
    for idx, w in enumerate(words):
        if w in sentence_words: 
            bag[idx] = 1
    return bag
