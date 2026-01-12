import { useState, useEffect, useCallback } from 'react';
import { problemsApi } from '../services/api';

/**
 * Custom hook for managing problems
 */
export const useProblems = (filters = {}) => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProblems = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await problemsApi.getAll(filters);
      setProblems(response.data.problems || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch problems');
      console.error('Error fetching problems:', err);
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(filters)]);

  useEffect(() => {
    fetchProblems();
  }, [fetchProblems]);

  const createProblem = async (data) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await problemsApi.create(data);
      await fetchProblems(); // Refresh list
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create problem');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateProblem = async (id, data) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await problemsApi.update(id, data);
      await fetchProblems(); // Refresh list
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update problem');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteProblem = async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      await problemsApi.delete(id);
      await fetchProblems(); // Refresh list
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete problem');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    problems,
    loading,
    error,
    fetchProblems,
    createProblem,
    updateProblem,
    deleteProblem,
  };
};

/**
 * Custom hook for single problem
 */
export const useProblem = (id) => {
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProblem = useCallback(async () => {
    if (!id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await problemsApi.getById(id);
      setProblem(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch problem');
      console.error('Error fetching problem:', err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProblem();
  }, [fetchProblem]);

  return {
    problem,
    loading,
    error,
    refetch: fetchProblem,
  };
};
