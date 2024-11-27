"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { StarIcon, CalendarIcon } from 'lucide-react';

type MovieDetails = {
  Title: string;
  Year: string;
  Plot: string;
  Poster: string;
  imdbRating: string;
  Genre: string;
  Director: string;
  Actors: string;
  Runtime: string;
  Released: string;
};

const MovieSearchComponent = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [movieDetails, setMovieDetails] = useState<MovieDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setError('Please enter a movie title to search.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setMovieDetails(null);

    try {
      const res = await fetch(
        `http://www.omdbapi.com/?apikey=${process.env.NEXT_PUBLIC_MY_API_KEY}&t=${encodeURIComponent(searchTerm)}`
      );

      if (!res.ok) {
        throw new Error('Network response error');
      }

      const data = await res.json();

      if (data.Response === 'False') {
        throw new Error(data.Error);
      }

      setMovieDetails(data);
    } catch (err: unknown) {
      const error = err as Error;
      console.error('Error fetching movie details:', error.message);
      setError(error.message || 'An error occurred. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-lg p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-1 text-center">Movie Search</h1>
        <p className="mb-6 text-center">Search for any movie and display details.</p>
        <div className="flex items-center mb-6">
          <input
            type="text"
            placeholder="Enter a movie title"
            value={searchTerm}
            onChange={handleChange}
            className="flex-1 mr-2 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-600 disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? 'Searching...' : 'Search'}
          </button>
        </div>
        {error && (
          <div className="text-red-500 text-center mb-4">{error}</div>
        )}
        {movieDetails && (
          <div className="flex flex-col items-center">
            <div className="w-full mb-4">
              <Image
                src={movieDetails.Poster !== 'N/A' ? movieDetails.Poster : '/default-poster.jpg'}
                alt={movieDetails.Title}
                width={200}
                height={300}
                className="rounded-md shadow-md mx-auto"
              />
            </div>
            <div className="w-full text-center">
              <h2 className="text-2xl font-bold mb-2">{movieDetails.Title}</h2>
              <p className="text-gray-600 mb-4 italic">{movieDetails.Plot || 'No plot available.'}</p>
              <div className="flex justify-center items-center text-gray-500 mb-2">
                <CalendarIcon className="w-4 h-4 mr-1" />
                <span className="mr-4">{movieDetails.Year}</span>
                <StarIcon className="w-4 h-4 mr-1 fill-yellow-500" />
                <span>{movieDetails.imdbRating}</span>
              </div>
              <p className="text-gray-500">
                <strong>Genre:</strong> {movieDetails.Genre}
              </p>
              <p className="text-gray-500">
                <strong>Director:</strong> {movieDetails.Director}
              </p>
              <p className="text-gray-500">
                <strong>Actors:</strong> {movieDetails.Actors}
              </p>
              <p className="text-gray-500">
                <strong>Runtime:</strong> {movieDetails.Runtime}
              </p>
              <p className="text-gray-500">
                <strong>Released:</strong> {movieDetails.Released}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieSearchComponent;
