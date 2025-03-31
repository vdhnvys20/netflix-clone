import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import './App.css';

const API_KEY = '2f6af458'; 

function App() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMovie, setSelectedMovie] = useState(null);

  useEffect(() => {
    const fetchRandomMovies = async () => {
      try {
        const randomSearches = ['action', 'comedy', 'drama', 'thriller', 'scifi', 'romance']; // Array of movie genres to search for
        const randomSearch = randomSearches[Math.floor(Math.random() * randomSearches.length)]; // Select a random genre from the array
        const response = await axios.get(
          `http://www.omdbapi.com/?s=${randomSearch}&apikey=${API_KEY}&page=${Math.floor(Math.random() * 3) + 1}` //Add random page number.
        );
        if (response.data.Search) {
          // Select a random movie from the search results
          const randomMovieIndex = Math.floor(Math.random() * response.data.Search.length);
          const movie = response.data.Search[randomMovieIndex];
          //Fetch more details for the selected movie.
          const movieDetails = await axios.get(
            `http://www.omdbapi.com/?i=${movie.imdbID}&apikey=${API_KEY}`
          );
          setMovies(prevMovies => [...prevMovies, movieDetails.data]);//add movie details to the array.
        }
      } catch (error) {
        console.error('Error fetching movies:', error);
      } finally {
        setLoading(false);
      }
    };
    const movieAmount = 15;
    const fetchMultipleMovies = async () => {
      setLoading(true);
      setMovies([]);
      for(let i = 0; i < movieAmount; i++){
        await fetchRandomMovies();
      }
      setLoading(false);
    }

    fetchMultipleMovies();
  }, []);

  const handleMovieClick = (movie) => {
    setSelectedMovie(movie);
  };

  const handleCloseModal = () => {
    setSelectedMovie(null);
  };

  const movieVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.1, transition: { duration: 0.2 } },
  };

  const modalVariants = {
    initial: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } },
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen text-white">
      <header className="p-4">
        <h1 className="text-2xl font-bold">Netflix Clone</h1>
      </header>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 p-4">
        {movies.map((movie) => (
          <motion.div
            key={movie.imdbID}
            variants={movieVariants}
            initial="initial"
            whileHover="hover"
            className="relative cursor-pointer overflow-hidden rounded-md"
            onClick={() => handleMovieClick(movie)}
          >
            <img
              src={movie.Poster}
              alt={movie.Title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
              <p className="text-lg">{movie.Title}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedMovie && (
          <motion.div
            variants={modalVariants}
            initial="initial"
            animate="visible"
            exit="exit"
            className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center"
            onClick={handleCloseModal}
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              className="bg-gray-800 p-8 rounded-lg max-w-2xl"
            >
              <img
                src={selectedMovie.Poster}
                alt={selectedMovie.Title}
                className="w-full rounded-md mb-4"
              />
              <h2 className="text-2xl font-bold mb-2">{selectedMovie.Title}</h2>
              <p>Year: {selectedMovie.Year}</p>
              <button
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-4"
                onClick={handleCloseModal}
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;